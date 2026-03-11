import { type Stmt } from './ast.js';
import { type Token } from './token.js';
export declare class Parser {
    private tokens;
    private currentPos;
    constructor(tokens: Token[]);
    parse(): Stmt[];
    private parseStmt;
    private parseReturnStmt;
    private parseExpressionStmt;
    private parsePrintStmt;
    private parseVarStmt;
    private parseFunctionStmt;
    private parseBlock;
    private parseExpression;
    private parseAddition;
    private parseMultiplication;
    private parseCall;
    private parsePrimary;
    private match;
    private consume;
    private check;
    private advance;
    private peek;
    private previous;
    private isAtEnd;
    private error;
}
