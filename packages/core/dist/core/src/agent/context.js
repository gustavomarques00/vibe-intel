import fg from "fast-glob";
import * as fs from "node:fs/promises";
/**
 * Carrega arquivos do diretório alvo de forma assíncrona.
 */
export async function loadFiles(globPattern) {
    const paths = await fg(globPattern, { absolute: true });
    return Promise.all(paths.map(async (filePath) => ({
        path: filePath,
        content: await fs.readFile(filePath, "utf8"),
    })));
}
//# sourceMappingURL=context.js.map