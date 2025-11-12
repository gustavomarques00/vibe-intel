/**
 * 🔄 Vibe Intel – Sync Notion Script
 * Atualiza status, entregáveis e duração das sprints automaticamente.
 * Compatível com: NodeNext + TurboRepo + semantic-release
 */

import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { simpleGit } from "simple-git";

dotenv.config();

const git = simpleGit();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// IDs das páginas Notion (usando .env ou hardcoded se necessário)
const SPRINT_PAGES: Record<number, string> = JSON.parse(
  process.env.NOTION_SPRINT_IDS || "{}"
);
const LINKEDIN_DB_ID = process.env.NOTION_LINKEDIN_DB_ID || "";

/* ---------------------------------------------------------
 * 🔍 Helpers
 * --------------------------------------------------------- */

// Detecta número da sprint pela branch
function getSprintFromBranch(branch?: string): number | null {
  if (!branch) return null;
  const match = branch.match(/sprint\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Atualiza status Notion
async function updateSprintStatus(sprintNumber: number, status: string) {
  const pageId = SPRINT_PAGES[sprintNumber];
  if (!pageId) return console.warn(`⚠️ Sprint ${sprintNumber} não mapeada`);

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { status: { name: status } },
      },
    });
    console.log(`✅ Sprint ${sprintNumber} → Status atualizado: ${status}`);
  } catch (error: any) {
    console.error(`❌ Erro ao atualizar status:`, error.message);
  }
}

/* ---------------------------------------------------------
 * 📋 Commits → Entregáveis
 * --------------------------------------------------------- */

async function getSprintCommits(branch: string): Promise<string[]> {
  try {
    const log = await git.log({ from: "main", to: branch });
    const commits = log.all.map((c: { message: string }) => c.message).filter(Boolean);

    return commits.map((msg: string) => {
      const match = msg.match(/^(\w+)(?:\([\w-]+\))?: (.+)$/);
      if (match) {
        const [, type, desc] = match;
        const emojiMap: Record<string, string> = {
          feat: "✨",
          fix: "🐛",
          docs: "📝",
          test: "🧪",
          refactor: "♻️",
          chore: "🔧",
        };
        const emoji = emojiMap[type] || "•";
        return `${emoji} ${desc}`;
      }
      return `• ${msg}`;
    });
  } catch (err) {
    console.error("Erro ao buscar commits:", (err as Error).message);
    return [];
  }
}

async function updateSprintDeliverables(sprintNumber: number, branch: string) {
  const pageId = SPRINT_PAGES[sprintNumber];
  const commits = await getSprintCommits(branch);
  if (!pageId || commits.length === 0) return;

  const deliverables = commits.slice(0, 20).join("\n"); // limita tamanho
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Entregáveis: {
          rich_text: [
            {
              type: "text",
              text: { content: deliverables },
            },
          ],
        },
      },
    });
    console.log(`📝 Entregáveis atualizados: ${commits.length} commits`);
  } catch (error: any) {
    console.error("❌ Erro ao atualizar entregáveis:", error.message);
  }
}

/* ---------------------------------------------------------
 * ⏱️ Cálculo de duração
 * --------------------------------------------------------- */

async function calculateSprintTime(branch: string) {
  try {
    const firstCommit = (await git.raw([
      "log",
      branch,
      "--reverse",
      "--format=%ct",
      "--max-count=1",
    ])).trim();

    const lastCommit = (await git.raw([
      "log",
      branch,
      "--format=%ct",
      "--max-count=1",
    ])).trim();

    if (!firstCommit || !lastCommit) return null;

    const start = new Date(parseInt(firstCommit) * 1000);
    const end = new Date(parseInt(lastCommit) * 1000);
    const diffMs = end.getTime() - start.getTime();

    return {
      days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
      start,
      end,
    };
  } catch {
    return null;
  }
}

async function updateSprintDuration(sprintNumber: number, branch: string) {
  const pageId = SPRINT_PAGES[sprintNumber];
  if (!pageId) return;
  const time = await calculateSprintTime(branch);
  if (!time) return;

  const totalDays = time.days + time.hours / 24;
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        "Duração (dias)": {
          number: Math.round(totalDays * 10) / 10,
        },
      },
    });
    console.log(`⏱️ Duração atualizada: ${time.days}d ${time.hours}h`);
  } catch (error: any) {
    console.error("❌ Erro ao atualizar duração:", error.message);
  }
}

/* ---------------------------------------------------------
 * 🚀 Execução principal
 * --------------------------------------------------------- */

const branch = process.env.GITHUB_REF_NAME || "";
const eventName = process.env.GITHUB_EVENT_NAME || "";
const prMerged = process.env.PR_MERGED === "true";
const sprintNumber = getSprintFromBranch(branch);

if (!sprintNumber) {
  console.log("ℹ️ Nenhuma sprint detectada na branch");
  process.exit(0);
}

(async () => {
  try {
    if (eventName === "push") {
      await updateSprintStatus(sprintNumber, "Em Desenvolvimento");
      await updateSprintDeliverables(sprintNumber, branch);
    } else if (eventName === "pull_request") {
      if (prMerged) {
        await updateSprintStatus(sprintNumber, "Concluído");
        await updateSprintDuration(sprintNumber, branch);
      } else {
        await updateSprintStatus(sprintNumber, "Testando");
      }
    }
  } catch (error: any) {
    console.error("❌ Erro geral:", error.message);
    process.exit(1);
  }
})();
