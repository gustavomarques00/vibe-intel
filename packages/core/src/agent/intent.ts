/**
 * Identifica a intenção de execução com base em metadados ou parâmetros do input.
 */
export function detectIntent(goal?: string): string {
  if (!goal) return "unknown";

  const normalized = goal.toLowerCase();
  if (["review", "analyze", "check"].includes(normalized)) return "code_review";
  if (["docs", "comment", "document"].includes(normalized)) return "docs_comment";
  if (["test", "qa", "verify"].includes(normalized)) return "generate_tests";

  return "unknown";
}
