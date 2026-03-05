---
name: reactflow-v12-migration
description: Migrates the codebase from reactflow v11 to @xyflow/react v12 using low-risk steps, compatibility checks, and regression validation for custom nodes/edges, parenting, and reconnect behavior.
---

# React Flow v12 Migration

Use this skill when upgrading React Flow dependencies and APIs.

## Workflow

1. Preflight audit.
- Locate all `reactflow` imports and version pins.
- Identify usages of known breaking APIs.

2. Migrate dependency/imports.
- Replace `reactflow` with `@xyflow/react`.
- Update CSS import paths as required.

3. Apply API migrations.
- `parentNode` -> `parentId`
- `onEdgeUpdate` -> `onReconnect`
- node/edge typing and measured dimension changes

4. Validate core interactions.
- create/edit/delete node
- connect/reconnect edges
- resize/select/drag
- parent/child container behavior

5. Lock migration with tests.
- run targeted unit/integration tests
- run regression snapshots on canvas states

## Guardrails

1. No feature work during migration PR.
2. Preserve behavior; avoid UI redesign in this phase.
3. Use a feature flag or isolated branch if needed.
4. Document exact follow-up fixes required for later phases.

