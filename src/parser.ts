import {
  BinaryExpr,
  CallExpr,
  ExpressionStmt,
  FunctionStmt,
  LiteralExpr,
  PrintStmt,
  ReturnStmt,
  VarStmt,
  VariableExpr,
  type Expr,
  type Stmt
} from './ast.js';
import { TokenKind, type Token } from './token.js';

export class Parser {
  private tokens: Token[];
  private currentPos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentPos = 0;
  }

  // Parse all statements
  parse(): Stmt[] {
    const stmts: Stmt[] = [];
    while (!this.isAtEnd()) {
      if (this.check(TokenKind.Illegal)) {
        const token = this.peek();
        throw this.error(token, `Invalid character '${token.lexeme}'`);
      }
      stmts.push(this.parseStmt());
    }

    return stmts;
  }

  // Parse a single statement
  private parseStmt(): Stmt {
    if (this.match(TokenKind.Print)) {
      return this.parsePrintStmt();
    }

    if (this.match(TokenKind.Let)) {
      return this.parseVarStmt();
    }

    if (this.match(TokenKind.Function)) {
      return this.parseFunctionStmt();
    }

    if (this.match(TokenKind.Return)) {
      return this.parseReturnStmt();
    }

    return this.parseExpressionStmt();
  }

  // Parse return statement
  private parseReturnStmt(): ReturnStmt {
    let value: Expr | null = null;
    // Check if there's a value to return (not just "फिर्ता" alone)
    if (!this.check(TokenKind.CloseCurly) && !this.isAtEnd()) {
      value = this.parseExpression();
    }
    return new ReturnStmt(value);
  }

  // Parse expression statement
  private parseExpressionStmt(): ExpressionStmt {
    const expr = this.parseExpression();
    return new ExpressionStmt(expr);
  }

  // Parse print statement
  private parsePrintStmt(): Stmt {
    this.consume(TokenKind.OpenParen, "Expect '(' after 'छाप'");
    const expr = this.parseExpression();
    this.consume(TokenKind.CloseParen, "Expect ')' after expression");
    return new PrintStmt(expr);
  }

  // Parse variable statement
  private parseVarStmt(): VarStmt {
    const name = this.consume(
      TokenKind.Identifier,
      "Expect variable name after 'मानौ'"
    );

    let initializer: Expr | null = null;
    if (this.match(TokenKind.Equal)) {
      initializer = this.parseExpression();
    }

    return new VarStmt(name, initializer);
  }

  // Parse function statement
  private parseFunctionStmt(): FunctionStmt {
    const name = this.consume(
      TokenKind.Identifier,
      "Expect function name after 'कार्य'"
    );
    this.consume(TokenKind.OpenParen, "Expect '(' after function name");

    const params: Token[] = [];
    if (!this.check(TokenKind.CloseParen)) {
      do {
        params.push(
          this.consume(TokenKind.Identifier, 'Expect parameter name')
        );
      } while (this.match(TokenKind.Comma));
    }

    this.consume(TokenKind.CloseParen, "Expect ')' after parameters");
    this.consume(TokenKind.OpenCurly, "Expect '{' before function body");

    const body = this.parseBlock();

    return new FunctionStmt(name, params, body);
  }

  // Parse block of statements
  private parseBlock(): Stmt[] {
    const statements: Stmt[] = [];

    while (!this.check(TokenKind.CloseCurly) && !this.isAtEnd()) {
      statements.push(this.parseStmt());
    }

    this.consume(TokenKind.CloseCurly, "Expect '}' after block");
    return statements;
  }

  // Parse expression
  private parseExpression(): Expr {
    return this.parseAddition();
  }

  // Parse addition and subtraction
  private parseAddition(): Expr {
    let expr = this.parseMultiplication();

    while (this.match(TokenKind.Plus, TokenKind.Minus)) {
      const operator = this.previous();
      const right = this.parseMultiplication();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  // Parse multiplication, division, and modulo
  private parseMultiplication(): Expr {
    let expr = this.parseCall();

    while (this.match(TokenKind.Star, TokenKind.Slash, TokenKind.Mod)) {
      const operator = this.previous();
      const right = this.parseCall();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  // Parse function calls
  private parseCall(): Expr {
    let expr = this.parsePrimary();

    while (this.match(TokenKind.OpenParen)) {
      const args: Expr[] = [];
      if (!this.check(TokenKind.CloseParen)) {
        do {
          args.push(this.parseExpression());
        } while (this.match(TokenKind.Comma));
      }
      this.consume(TokenKind.CloseParen, "Expect ')' after arguments");

      if (expr instanceof VariableExpr) {
        expr = new CallExpr(expr, args);
      } else {
        throw this.error(this.previous(), 'Can only call functions');
      }
    }

    return expr;
  }

  // Parse primary expressions
  private parsePrimary(): Expr {
    if (this.match(TokenKind.String, TokenKind.Number)) {
      return new LiteralExpr(this.previous().lexeme);
    }

    if (this.match(TokenKind.Identifier)) {
      return new VariableExpr(this.previous());
    }

    if (this.match(TokenKind.OpenParen)) {
      const expr = this.parseExpression();
      this.consume(TokenKind.CloseParen, "Expect ')' after expression");
      return expr;
    }

    throw this.error(this.peek(), 'Expression expected.');
  }

  // Match and consume token if it matches any of the kinds
  private match(...kinds: TokenKind[]): boolean {
    for (const kind of kinds) {
      if (this.check(kind)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  // Consume expected token or throw error
  private consume(kind: TokenKind, message: string): Token {
    if (this.check(kind)) return this.advance();
    throw this.error(this.peek(), message);
  }

  // Check if current token matches kind
  private check(kind: TokenKind): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().kind === kind;
  }

  // Advance to next token
  private advance(): Token {
    if (!this.isAtEnd()) this.currentPos++;
    return this.previous();
  }

  // Peek at current token
  private peek(): Token {
    return this.tokens[this.currentPos]!;
  }

  // Get previous token
  private previous(): Token {
    return this.tokens[this.currentPos - 1]!;
  }

  // Check if at end of input
  private isAtEnd(): boolean {
    return this.peek().kind === TokenKind.Eof;
  }

  // Create error with message
  private error(token: Token, message: string): Error {
    return new Error(`> [line ${token.line}] Error: ${message}`);
  }
}
