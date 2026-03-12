import { keywords, Token, TokenKind } from './token.js';
export class Lexer {
    source;
    tokens;
    startPos;
    currentPos;
    line;
    // Initialize lexer with source
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.startPos = 0;
        this.currentPos = 0;
        this.line = 1;
    }
    // Read all tokens from source
    readTokens() {
        while (!this.isAtEnd()) {
            this.startPos = this.currentPos;
            this.readToken();
        }
        this.tokens.push(new Token(TokenKind.Eof, '', this.line));
        return this.tokens;
    }
    // Read single token
    readToken() {
        const char = this.readChar();
        switch (char) {
            case ',':
                this.createToken(TokenKind.Comma);
                break;
            case ':':
                this.createToken(TokenKind.Colon);
                break;
            case '.':
                this.createToken(TokenKind.Period);
                break;
            case ';':
                this.createToken(TokenKind.Semicolon);
                break;
            case '(':
                this.createToken(TokenKind.OpenParen);
                break;
            case ')':
                this.createToken(TokenKind.CloseParen);
                break;
            case '{':
                this.createToken(TokenKind.OpenCurly);
                break;
            case '}':
                this.createToken(TokenKind.CloseCurly);
                break;
            case '+':
                this.createToken(TokenKind.Plus);
                break;
            case '-':
                this.createToken(TokenKind.Minus);
                break;
            case '*':
                this.createToken(TokenKind.Star);
                break;
            case '/':
                this.createToken(TokenKind.Slash);
                break;
            case '%':
                this.createToken(TokenKind.Mod);
                break;
            case '!':
                this.createToken(TokenKind.Bang);
                break;
            case '=':
                this.createToken(TokenKind.Equal);
                break;
            /* Handle whitespaces */
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.readDevanagariString();
                break;
            default:
                if (this.isDevnagariChar(char)) {
                    if (this.isDevanagariDigit(char))
                        this.readDevanagariDigit();
                    else
                        this.readDevanagariIdentifier();
                }
                else if (!this.isWhitespace(char)) {
                    // Report invalid character
                    throw new Error(`Invalid character '${char}' at line ${this.line}. ` +
                        `Only Devanagari characters, numbers, special characters, and whitespace are allowed.`);
                }
                break;
        }
    }
    // Read next character from source
    readChar() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.currentPos++);
    }
    // Create token from current lexeme
    createToken(kind, literal) {
        if (literal === undefined)
            literal = null;
        const text = this.source.substring(this.startPos, this.currentPos);
        this.tokens.push(new Token(kind, text, this.line));
    }
    // Check if at end of source
    isAtEnd() {
        return this.currentPos >= this.source.length;
    }
    // Peek at next character
    peekNextChar() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.currentPos);
    }
    // Get and advance to next character
    getNextChar() {
        return this.source.charAt(this.currentPos++);
    }
    // Check if character is Devanagari
    isDevnagariChar(char) {
        return (('\u{0900}' <= char && char <= '\u{097F}') ||
            ('\u{A8E0}' <= char && char <= '\u{A8FF}'));
    }
    // Check if character is Devanagari digit
    isDevanagariDigit(char) {
        return '\u{0966}' <= char && char <= '\u{096F}';
    }
    // Check if character is whitespace
    isWhitespace(char) {
        return char === ' ' || char === '\r' || char === '\t' || char === '\n';
    }
    // Read Devanagari digit sequence
    readDevanagariDigit() {
        while (this.isDevanagariDigit(this.peekNextChar()))
            this.getNextChar();
        const literal = this.source.substring(this.startPos, this.currentPos);
        this.createToken(TokenKind.Number, literal);
    }
    // Read Devanagari identifier
    readDevanagariIdentifier() {
        while (this.isDevnagariChar(this.peekNextChar()))
            this.getNextChar();
        const literal = this.source.substring(this.startPos, this.currentPos);
        const keywordKind = keywords[literal];
        if (keywordKind)
            this.createToken(keywordKind, literal);
        else
            this.createToken(TokenKind.Identifier, literal);
    }
    // Read string literal
    readDevanagariString() {
        while (this.peekNextChar() != '"' && !this.isAtEnd()) {
            if (this.peekNextChar() === '\n')
                this.line++;
            this.getNextChar();
        }
        this.getNextChar();
        const content = this.source.substring(this.startPos + 1, this.currentPos - 1);
        this.createToken(TokenKind.String, content);
    }
}
