import { GoogleGenAI, Type } from "@google/genai";

/** Default Gemini model — keep in sync with DEFAULT_MODELS in aiService.ts */
const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: any }[];
}

export const getSystemInstruction = () => `
# FlowMind DSL Conversion Prompt

You are an assistant that converts plain human language into **FlowMind DSL**.

Your job:
- Read any messy, casual, incomplete, or informal description of a flow.
- If a history of conversation is provided, use it to understand the context and potential refinements requested by the user.
- If an image is provided, analyze the flowchart, diagram, or sketch in the image and convert it into FlowMind DSL.
- Infer missing steps when they are obvious.
- Convert everything into valid **FlowMind DSL syntax**.
- Keep node labels short, clear, and human-readable.
- Use correct node types wherever possible.
- If unsure about a node type, default to \`[process]\`.
- Always output **only FlowMind DSL**, nothing else.

## Rules You Must Follow

1. Always start with a document header:
   - Include \`flow\`
   - Include \`direction\` (default to \`TB\` unless user implies horizontal)

2. Supported node types:
   - \`[start]\`
   - \`[end]\`
   - \`[process]\`
   - \`[decision]\`
   - \`[system]\`
   - \`[note]\`
   - \`[section]\`
   - \`[browser]\` (for web pages)
   - \`[mobile]\` (for mobile apps)
   - \`[button]\` (for UI buttons)
   - \`[input]\` (for text fields)
   - \`[icon]\` (Lucide icon name)
   - \`[image]\` (image placeholder)

3. Connections:
   - Use \`->\` for connections
   - Use \`->|label|\` for decision paths

4. **Strict Structure**:
   - Define all **Nodes** first.
   - Define all **Edges** second.
   - Do NOT mix them (e.g. \`[start] A -> [end] B\` is INVALID). 
   - Write \`[start] A\` on one line, \`[end] B\` on another, then \`A -> B\`.

5. Use comments \`#\` only when they add clarity.

6. Do NOT explain the output. Do NOT add prose. Only output DSL.

7. **Node IDs**:
   - If the label is simple (e.g., "Login"), you can use it as the ID: \`[process] Login\`.
   - If the label is long, use an ID: \`[process] login_step: User enters credentials\`.

`;

function processImage(imageBase64?: string): { mimeType: string; cleanBase64: string } {
  const regex = /^data:image\/([^;]+);base64,/;
  const match = imageBase64?.match(regex);
  const mimeType = match ? `image/${match[1]}` : 'image/png';
  const cleanBase64 = imageBase64?.replace(regex, '') || '';
  return { mimeType, cleanBase64 };
}

export async function generateDiagramFromChat(
  history: ChatMessage[],
  newMessage: string,
  currentDSL?: string,
  imageBase64?: string,
  userApiKey?: string,
  modelId?: string
): Promise<string> {
  const apiKey = userApiKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please add it in Settings → Brand → Flowpilot.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const newMessageContent = {
    role: 'user' as const,
    parts: [
      {
        text: `User Request: ${newMessage}${currentDSL ? `\nCURRENT CONTENT (The user wants to update this):\n${currentDSL}` : ''}\n\nGenerate or update the FlowMind DSL based on this request.`
      }
    ] as { text?: string; inlineData?: any }[]
  };

  if (imageBase64) {
    const { mimeType, cleanBase64 } = processImage(imageBase64);
    newMessageContent.parts.push({ inlineData: { data: cleanBase64, mimeType } });
  }

  const contents = [...history, newMessageContent];

  const response = await ai.models.generateContent({
    model: modelId || GEMINI_DEFAULT_MODEL,
    contents,
    config: {
      systemInstruction: getSystemInstruction(),
      responseMimeType: "text/plain",
    }
  });

  if (!response.text) throw new Error("No response from AI");

  return response.text;
}

export async function generateDiagramFromPrompt(
  prompt: string,
  currentNodesJSON: string,
  focusedContextJSON?: string,
  imageBase64?: string,
  userApiKey?: string
): Promise<string> {
  const contextParts = [
    currentNodesJSON && `Current Diagram State (JSON): ${currentNodesJSON}`,
    focusedContextJSON && `Focused Context (Selected Nodes): ${focusedContextJSON}`,
  ].filter(Boolean).join('\n');

  return generateDiagramFromChat([], prompt, contextParts || undefined, imageBase64, userApiKey);
}