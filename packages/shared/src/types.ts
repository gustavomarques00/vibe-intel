export type VibeModel = "gpt-4o-mini" | "gpt-4o" | "gpt-4-turbo";

export interface VibeAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface VibeAIRequest {
  model?: VibeModel;
  messages: VibeAIMessage[];
  temperature?: number;
  maxTokens?: number;
  skill?: string;      
  env?: string;        
}

export interface VibeAIResponse {
  raw: unknown;
  content: string;
}

/**
 * Evento de telemetria no estilo MCP:
 * registra início/fim/erro de uma execução de ferramenta.
 */
export interface VibeTelemetryEvent {
  type: "start" | "finish" | "error";
  skill: string;
  payload?: unknown;
  result?: unknown;
  error?: unknown;
  timestamp: string;
}

export interface VibeSkillContext {
  env: "local" | "ci" | "cloud";
  model?: VibeModel;
  projectRoot?: string;
  telemetry?: {
    onEvent?(event: VibeTelemetryEvent): void;
  };
}

export interface VibeRunInput<TPayload = unknown> {
  skill: string;
  payload: TPayload;
  context: VibeSkillContext;
}
