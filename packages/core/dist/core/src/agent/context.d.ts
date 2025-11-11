/**
 * Carrega arquivos do diretório alvo de forma assíncrona.
 */
export declare function loadFiles(globPattern: string): Promise<{
    path: string;
    content: string;
}[]>;
