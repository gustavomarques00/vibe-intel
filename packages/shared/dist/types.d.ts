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
/**
 * Mapa base de skills.
 * Cada pacote (ex: vibe-core) pode estender esse mapa via `declare module`.
 * Exemplo:
 * declare module "@devflow-modules/vibe-shared" {
 *   interface SkillMapBase {
 *     code_review: { input: CodeReviewInput; output: CodeReviewResult };
 *   }
 * }
 */
export interface SkillMapBase {
}
/**
 * Mapa completo de skills disponíveis (depois da extensão).
 */
export type SkillMap = SkillMapBase;
/**
 * Entrada genérica para execução de uma skill.
 * O tipo de payload e output é inferido automaticamente do SkillMap.
 */
export interface VibeRunInput<K extends keyof SkillMap = keyof SkillMap> {
    skill: K;
    payload: SkillMap[K]["input"];
    context: VibeSkillContext;
}
/**
 * Saída genérica de execução de uma skill.
 * Inferido automaticamente com base na skill passada.
 */
export type VibeRunOutput<K extends keyof SkillMap> = SkillMap[K]["output"];
