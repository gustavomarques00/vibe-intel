/**
 * 📊 Vibe Intel – Weekly Report Generator
 * Gera relatório semanal das sprints no Notion.
 * Compatível com NodeNext + dotenv + TurboRepo CI.
 */

import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const SPRINT_DB_ID = (process.env.NOTION_SPRINT_DB_ID || "").replace(/-/g, "");

if (!SPRINT_DB_ID) {
  console.error("❌ Faltando variável NOTION_SPRINT_DB_ID no .env");
  process.exit(1);
}

/* ---------------------------------------------------------
 * 🔍 Funções utilitárias
 * --------------------------------------------------------- */

type SprintStatus = "Em Desenvolvimento" | "Em Testes" | "Concluída";

interface SprintEntry {
  name: string;
  fase?: string;
  status: SprintStatus;
}

async function fetchActiveSprints(): Promise<SprintEntry[]> {
  try {
    const response = await notion.databases.query({
      database_id: SPRINT_DB_ID,
      filter: {
        or: [
          { property: "Status", status: { equals: "Em Desenvolvimento" } },
          { property: "Status", status: { equals: "Em Testes" } },
          { property: "Status", status: { equals: "Concluída" } },
        ],
      },
    });

    return response.results.map((sprint: any) => ({
      name: sprint.properties?.Sprint?.title?.[0]?.plain_text ?? "Sem nome",
      status: sprint.properties?.Status?.status?.name ?? "Indefinido",
      fase: sprint.properties?.Fase?.select?.name,
    }));
  } catch (error: any) {
    console.error("❌ Erro ao buscar sprints:", error.message);
    return [];
  }
}

/* ---------------------------------------------------------
 * 🧮 Geração do relatório
 * --------------------------------------------------------- */

function groupByStatus(sprints: SprintEntry[]) {
  const byStatus: Record<SprintStatus, SprintEntry[]> = {
    "Em Desenvolvimento": [],
    "Em Testes": [],
    "Concluída": [],
  };

  sprints.forEach((s) => {
    if (byStatus[s.status as SprintStatus]) byStatus[s.status as SprintStatus].push(s);
  });

  return byStatus;
}

function buildReport(sprints: SprintEntry[]) {
  const grouped = groupByStatus(sprints);
  const total = sprints.length;
  const concluido = grouped["Concluída"].length;
  const progresso = total > 0 ? Math.round((concluido / total) * 100) : 0;

  return `📊 **Relatório Semanal - Vibe Intel**

🗓️ Data: ${new Date().toLocaleDateString("pt-BR")}

🚀 **Em Desenvolvimento (${grouped["Em Desenvolvimento"].length})**
${grouped["Em Desenvolvimento"]
  .map((s) => `  • ${s.name} [${s.fase ?? "-"}]`)
  .join("\n") || "  (nenhuma)"}

🧪 **Em Testes (${grouped["Em Testes"].length})**
${grouped["Em Testes"]
  .map((s) => `  • ${s.name} [${s.fase ?? "-"}]`)
  .join("\n") || "  (nenhuma)"}

✅ **Concluídas (${grouped["Concluída"].length})**
${grouped["Concluída"]
  .map((s) => `  • ${s.name} [${s.fase ?? "-"}]`)
  .join("\n") || "  (nenhuma)"}

---
📈 Total de Sprints Ativas: ${total}
📊 Progresso Geral: ${progresso}%`.trim();
}

function saveReport(report: string) {
  const reportsDir = path.resolve("reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const filePath = path.join(
    reportsDir,
    `weekly-${new Date().toISOString().split("T")[0]}.md`
  );

  fs.writeFileSync(filePath, report, "utf8");
  console.log(`📁 Relatório salvo em: ${filePath}`);
}

/* ---------------------------------------------------------
 * 🚀 Execução principal
 * --------------------------------------------------------- */

(async () => {
  const sprints = await fetchActiveSprints();

  if (sprints.length === 0) {
    console.log("ℹ️ Nenhuma sprint ativa encontrada.");
    process.exit(0);
  }

  const report = buildReport(sprints);
  console.log(report);
  saveReport(report);
})();