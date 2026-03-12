import { Token, TokenKind } from './token.js';
export declare class Lexer {
    private source;
    private tokens;
    private startPos;
    private currentPos;
    private line;
    constructor(source: string);
    readTokens(): Token[];
    readToken(): void;
    readChar(): string;
    createToken(kind: TokenKind, literal?: any): void;
    private isAtEnd;
    private peekNextChar;
    private getNextChar;
    private isDevnagariChar;
    private isDevanagariDigit;
    private isWhitespace;
    private readDevanagariDigit;
    private readDevanagariIdentifier;
    private readDevanagariString;
}
