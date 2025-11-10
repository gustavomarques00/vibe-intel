export type VibeRunInput = {
  goal: string;
  data?: unknown;
  files?: string[];
};

export type VibeSkillContext = {
  ai: import("openai").OpenAI;
  input: VibeRunInput;
};
