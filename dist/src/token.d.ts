export declare enum TokenKind {
    Eof = "Eof",
    Illegal = "Illegal",
    Comma = "Comma",
    Colon = "Colon",
    Period = "Period",
    Semicolon = "Semicolon",
    OpenParen = "OpenParen",
    CloseParen = "CloseParen",
    OpenCurly = "OpenCurly",
    CloseCurly = "CloseCurly",
    Plus = "Plus",
    Minus = "Minus",
    Star = "Star",
    Slash = "Slash",
    Mod = "Mod",
    Bang = "Bang",
    Equal = "Equal",
    Number = "Number",
    Character = "Character",
    String = "String",
    Identifier = "Identifier",
    Let = "Let",
    Function = "Function",
    Print = "Print",
    Return = "Return",
    If = "If",
    Else = "Else",
    True = "True",
    False = "False"
}
export declare const keywords: Record<string, TokenKind>;
export declare class Token {
    kind: TokenKind;
    lexeme: string;
    line: number;
    constructor(kind: TokenKind, lexeme: string, line: number);
}
