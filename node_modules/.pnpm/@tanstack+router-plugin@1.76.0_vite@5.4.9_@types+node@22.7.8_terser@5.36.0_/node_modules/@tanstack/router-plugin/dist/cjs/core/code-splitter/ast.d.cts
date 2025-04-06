import * as babel from '@babel/core';
export type ParseAstOptions = {
    code: string;
    filename: string;
    root: string;
};
export declare function parseAst(opts: ParseAstOptions): import('@babel/parser').ParseResult<babel.types.File> | null;
