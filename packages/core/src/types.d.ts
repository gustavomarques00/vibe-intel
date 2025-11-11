import type { VibeSkillContext, VibeRunInput } from "@devflow-modules/vibe-shared";

export interface VibeSkillContext {
  env: "local" | "ci" | "cloud";
  model?: VibeModel;
  projectRoot?: string;
  telemetry?: {
    onStart?(skill: string, payload: unknown): void;
    onFinish?(skill: string, result: unknown): void;
  };
}

export interface VibeRunInput<TPayload = unknown> {
  skill: string;
  payload: TPayload;
  context: VibeSkillContext;
}

export type { VibeSkillContext, VibeRunInput };