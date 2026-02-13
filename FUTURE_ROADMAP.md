# Future Features Roadmap & Audit Report

This document outlines the implementation strategy, feasibility, and risk assessment for the three major feature sets proposed for FlowMind: **Interactive AI Iteration**, **Smart Diagram Analysis**, and **Playback Mode**.

---

## 1. Interactive AI Iteration (Conversational Editing)

### Goal
Enable users to refine diagrams through a chat-like interface, allowing for incremental updates rather than full regenerations.

### Implementation Strategy
1.  **State Management**: Implement a `chatHistory` state in `useAIGeneration` to store previous prompts and AI responses.
2.  **Service Layer**: Update `geminiService.ts` to use Gemini's `startChat()` session instead of `generateContent()`.
3.  **Prompt Refinement**: Include the current "source of truth" (the FlowMind DSL) in every chat turn so the AI can "patch" the existing code rather than rewrite it from scratch.
4.  **UI Updates**: Modify `AIView.tsx` to include a message bubble history and a persistent input field.

### Audit & Feasibility
-   **Feasibility**: **High**. Gemini 2.5 Flash-Lite is highly capable of multi-turn conversations.
-   **Impact**: **Critical**. This transforms the tool from an "AI Generator" to an "AI Collaborator."
-   **Risks**:
    *   **Context Bloat**: Long conversations might hit token limits.
    *   **Regression**: AI might accidentally remove valid parts of the diagram during a "patch" request.
-   **Audit Detail**: Requires a robust Diffing algorithm to ensure the UI only updates changed nodes/edges to keep animations smooth.

---

## 2. Smart Diagram Analysis (AI Linter)

### Goal
Automatically detect logical flaws, dead ends, and optimization opportunities in the diagram.

### Implementation Strategy
1.  **Static Analysis**: Implement a graph traversal engine (BFS/DFS) to find:
    *   **Orphaned Nodes**: No incoming edges.
    *   **Dead Ends**: Non-terminal nodes with no outgoing edges.
    *   **Infinite Loops**: Cycles without a clear "break" condition.
2.  **AI Semantical Analysis**: Pass the DSL to Gemini with a "Linter Prompt" to identify logical errors (e.g., "This approval step is missing a rejection path").
3.  **UI Feedback**: Show "Warnings" or "Errors" in the side panel or as badges on the nodes themselves.

### Audit & Feasibility
-   **Feasibility**: **Medium**. Static analysis is easy; semantic analysis depends on AI consistency.
-   **Impact**: **High**. Increases confidence in the correctness of the generated flows.
-   **Risks**:
    *   **False Positives**: AI might flag valid but complex logic as "wrong."
    *   **Performance**: Deep graph analysis on very large diagrams could lag the UI.
-   **Audit Detail**: Need to define a "Validation Schema" for what constitutes a "correct" flow in the context of FlowMind DSL.

---

## 3. Playback Mode (Interactive Walkthrough)

### Goal
A "Presentation Mode" where users can step through the flow node-by-node to explain the logic.

### Implementation Strategy
1.  **Sequencing Engine**: Map the graph into a linear or branched sequence based on the starting node.
2.  **UI Controls**: Add a floating transport bar (Prev, Play/Pause, Next).
3.  **Active State Styling**: Highlight the current "Active" node with a glow effect or high-contrast border.
4.  **Auto-Camera**: Use React Flow's `fitView` or `setCenter` to automatically pan/zoom to the active node during playback.

### Audit & Feasibility
-   **Feasibility**: **High**. React Flow is built for this type of state-driven viewport control.
-   **Impact**: **Medium**. Transformation from a "Drafting Tool" to a "Communication Tool."
-   **Risks**:
    *   **Complex Branching**: How to decide which path to follow on a decision node during "Auto-Play"?
    *   **Overlapping UI**: Ensuring the transport bar doesn't block critical diagram parts.
-   **Audit Detail**: Needs a `stepHistory` stack to allow users to "Go Back" even in complex branched logic.

---

## Summary of Impact vs. Effort

| Feature | Effort | Impact | Feasibility |
| :--- | :--- | :--- | :--- |
| **Conversational AI** | Medium | Critical | 95% |
| **Smart Analysis** | High | High | 70% |
| **Playback Mode** | Low | Medium | 100% |

## Recommended Phase 1 Focus
**Conversational AI** provides the most immediate "Wow" factor and utility with relatively low technical risk compared to a full semantic analyzer.
