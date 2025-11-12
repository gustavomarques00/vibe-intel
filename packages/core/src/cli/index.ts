import { runAgent } from "../agent/agent.js";
import type { VibeRunInput } from "../types.js";

export async function runCLI() {
  const input: VibeRunInput = {
    skill: "code_review",
    payload: {
      files: [
        { path: "example.ts", content: "console.log('Hello');" }
      ],
    },
    context: {
      env: "local",
      model: "gpt-4o-mini",
      telemetry: {
        onEvent(event: any) {
          console.log(`[${event.type}] ${event.skill}`, event.payload ?? event.result);
        },
      },

    },
  };

  const result = await runAgent(input);
  console.log(JSON.stringify(result, null, 2));
}
