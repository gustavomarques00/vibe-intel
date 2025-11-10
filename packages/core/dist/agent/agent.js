"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTask = runTask;
const shared_1 = require("@vibe/shared");
const intent_1 = require("./intent");
const skills_1 = require("../skills");
async function runTask(input) {
    const intent = await (0, intent_1.detectIntent)(input);
    const skill = skills_1.skills[intent] ?? skills_1.skills.review;
    const result = await skill({
        ai: shared_1.ai,
        input
    });
    return {
        intent,
        result
    };
}
