#!/usr/bin/env node
import { Command } from "commander";
import { runTask } from "../agent/agent";
import { loadFiles } from "../agent/context";

const program = new Command();

program
  .name("vibe")
  .description("Dev Intelligence CLI")
  .version("0.1.0");

program
  .command("review")
  .argument("<glob>", "arquivos ou pasta (ex: 'src/**/*.ts')")
  .action(async (glob) => {
    try {
      const files = await loadFiles(glob);
      const out = await runTask({ goal: "review", files });
      // saída JSON bonita
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(out, null, 2));
    } catch (err) {
      console.error("Erro na execução:", err);
      process.exit(1);
    }
  });

program
  .command("tests")
  .argument("<glob>", "arquivos ou pasta")
  .action(async (glob) => {
    const files = await loadFiles(glob);
    const out = await runTask({ goal: "tests", files });
    console.log(JSON.stringify(out, null, 2));
  });

program.parse();
