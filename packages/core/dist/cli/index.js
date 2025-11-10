#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const agent_1 = require("../agent/agent");
const context_1 = require("../agent/context");
const program = new commander_1.Command();
program
    .name("vibe")
    .description("Dev Intelligence CLI")
    .version("0.1.0");
program
    .command("review")
    .argument("<glob>", "arquivos ou pasta (ex: 'src/**/*.ts')")
    .action(async (glob) => {
    try {
        const files = await (0, context_1.loadFiles)(glob);
        const out = await (0, agent_1.runTask)({ goal: "review", files });
        // saída JSON bonita
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(out, null, 2));
    }
    catch (err) {
        console.error("Erro na execução:", err);
        process.exit(1);
    }
});
program
    .command("tests")
    .argument("<glob>", "arquivos ou pasta")
    .action(async (glob) => {
    const files = await (0, context_1.loadFiles)(glob);
    const out = await (0, agent_1.runTask)({ goal: "tests", files });
    console.log(JSON.stringify(out, null, 2));
});
program.parse();
