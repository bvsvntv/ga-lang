import { Token, TokenKind } from './token.js';
export declare class Lexer {
    private source;
    private tokens;
    private startPos;
    private currentPos;
    private line;
    constructor(source: string);
    /**
     * Read tokens from source
     */
    readTokens(): Token[];
    /**
     * Read individual lexeme
     */
    readToken(): void;
    /**
     * Read character
     */
    readChar(): string;
    /**
     * Create token out of individual lexeme
     * @param {TokenKind} kind
     * @param {any} literal
     */
    createToken(kind: TokenKind, literal?: any): void;
    /**
     * Check if we've reached the end of file
     */
    private isAtEnd;
    /**
     * Peek next character
     */
    private peekNextChar;
    /**
     * Get next character
     */
    private getNextChar;
    /**
     * Check if the character is devanagari character
     * @param {string} char
     */
    private isDevnagariChar;
    /**
     * Check if the character is devanagari digit
     * @param {string} char
     */
    private isDevanagariDigit;
    /**
     * Check if the character is whitespace
     * @param {string} char
     */
    private isWhitespace;
    /**
     * Read devanagari character sequence as number
     */
    private readDevanagariDigit;
    /**
     * Read devanagari character sequence as identifier
     */
    private readDevanagariIdentifier;
    /**
     * Read string literals
     */
    private readDevanagariString;
}
