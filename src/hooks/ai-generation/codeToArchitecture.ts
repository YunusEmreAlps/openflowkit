export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'java'
  | 'ruby'
  | 'csharp'
  | 'cpp'
  | 'rust';

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  go: 'Go',
  java: 'Java',
  ruby: 'Ruby',
  csharp: 'C#',
  cpp: 'C++',
  rust: 'Rust',
};

export const FILE_EXTENSION_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  py: 'python',
  go: 'go',
  java: 'java',
  rb: 'ruby',
  cs: 'csharp',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  rs: 'rust',
};

export interface CodeToArchitectureOptions {
  code: string;
  language: SupportedLanguage;
}

export function buildCodeToArchitecturePrompt({ code, language }: CodeToArchitectureOptions): string {
  return `Analyze this ${LANGUAGE_LABELS[language]} source code and generate a clean architecture diagram.

Identify the main modules, services, classes, functions, and their dependencies. Focus on the high-level structure — not every line of code, only meaningful architectural components and relationships.

Guidelines:
- Use [system] nodes for services, classes, modules, databases, external APIs
- Use [browser] or [mobile] nodes for frontend surfaces if present
- Use [section] to group related components (e.g. "Frontend", "Backend", "Database Layer")
- Use [process] nodes for key operations or workflows
- Show data flow and dependencies as edges with clear labels
- Add appropriate icons and colors to make the diagram readable

SOURCE CODE (${LANGUAGE_LABELS[language]}):
\`\`\`${language}
${code}
\`\`\``;
}
