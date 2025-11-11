import { runCodeReview } from "./code_review.js";
const skills = {
    code_review: runCodeReview,
};
export function getSkill(name) {
    const skill = skills[name];
    if (!skill)
        throw new Error(`Skill not found: ${name}`);
    return skill;
}
