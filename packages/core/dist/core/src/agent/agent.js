import { getSkill } from "../skills/index.js";
export async function runAgent(input) {
    const skill = getSkill(input.skill);
    // opcional: evento high-level de agent
    input.context.telemetry?.onEvent?.({
        type: "start",
        skill: input.skill,
        payload: input.payload,
        timestamp: new Date().toISOString(),
    });
    const result = await skill(input.payload, input.context);
    input.context.telemetry?.onEvent?.({
        type: "finish",
        skill: input.skill,
        result,
        timestamp: new Date().toISOString(),
    });
    return result;
}
//# sourceMappingURL=agent.js.map