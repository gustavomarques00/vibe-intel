# Vibe Intel MCP-ready Core

## Visão

`@devflow-modules/vibe-core` implementa um "tool server" compatível com o conceito de
Model Context Protocol (MCP) da OpenAI:

- Cada chamada é um `VibeRunInput` com:
  - `skill`: nome da ferramenta
  - `payload`: dados brutos
  - `context`: metadata de ambiente e telemetria

- Cada skill:
  - valida o payload (Zod)
  - chama o modelo via `@devflow-modules/vibe-shared/ai`
  - emite eventos de telemetria MCP-like (`start`, `finish`, `error`).

## Contratos

Ver `@devflow-modules/vibe-shared/src/types.ts`:

- `VibeRunInput`
- `VibeSkillContext`
- `VibeTelemetryEvent`
- `VibeAIRequest` / `VibeAIResponse`

## Telemetria

Para plugar em um sistema de auditoria:

```ts
context.telemetry = {
  onEvent(event: any) {
    // enviar para log central, queue ou observability
  },
};

Variável VIBE_AUDIT_LOGS=1 pode ser usada para log local de debug.
