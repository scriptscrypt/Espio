import { tool, type CoreTool } from "ai";
import { SolanaAgentKit } from "../agent";
import { executeAction } from "../utils/actionExecutor";
import { Action } from "../types/action";

export function createSolanaTools(
  solanaAgentKit: SolanaAgentKit,
  actions: Action[],
): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {};

  for (const [index, action] of actions.entries()) {
    tools[index.toString()] = tool({
      id: action.name as `${string}.${string}`,
      description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}
      `.slice(0, 1023),
      parameters: action.schema,
      execute: async (params: Record<string, unknown>) =>
        await executeAction(action, solanaAgentKit, params),
    });
  }

  return tools;
}
