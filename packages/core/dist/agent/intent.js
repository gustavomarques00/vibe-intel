"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectIntent = detectIntent;
async function detectIntent(input) {
    // Versão inicial: usa goal direto
    if (input.goal === "tests" || input.goal === "docs") {
        return input.goal;
    }
    return "review";
}
