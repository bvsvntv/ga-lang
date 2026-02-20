import { BinaryExpr, CallExpr, ExpressionStmt, FunctionStmt, LiteralExpr, PrintStmt, ReturnStmt, VarStmt, VariableExpr } from './ast.js';
import { TokenKind } from './token.js';
export class Parser {
    tokens;
    currentPos;
    constructor(tokens) {
        this.tokens = tokens;
        this.currentPos = 0;
    }
    parse() {
        const stmts = [];
        while (!this.isAtEnd()) {
            if (this.check(TokenKind.Illegal)) {
                const token = this.peek();
                throw this.error(token, `Invalid character '${token.lexeme}'`);
            }
            stmts.push(this.parseStmt());
        }
        return stmts;
    }
    parseStmt() {
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
    parseReturnStmt() {
        let value = null;
        // Check if there's a value to return (not just "फिर्ता" alone)
        if (!this.check(TokenKind.CloseCurly) && !this.isAtEnd()) {
            value = this.parseExpression();
        }
        return new ReturnStmt(value);
    }
    parseExpressionStmt() {
        const expr = this.parseExpression();
        return new ExpressionStmt(expr);
    }
    parsePrintStmt() {
        this.consume(TokenKind.OpenParen, "Expect '(' after 'छाप'");
        const expr = this.parseExpression();
        this.consume(TokenKind.CloseParen, "Expect ')' after expression");
        return new PrintStmt(expr);
    }
    parseVarStmt() {
        const name = this.consume(TokenKind.Identifier, "Expect variable name after 'मानौ'");
        let initializer = null;
        if (this.match(TokenKind.Equal)) {
            initializer = this.parseExpression();
        }
        return new VarStmt(name, initializer);
    }
    parseFunctionStmt() {
        const name = this.consume(TokenKind.Identifier, "Expect function name after 'कार्य'");
        this.consume(TokenKind.OpenParen, "Expect '(' after function name");
        const params = [];
        if (!this.check(TokenKind.CloseParen)) {
            do {
                params.push(this.consume(TokenKind.Identifier, 'Expect parameter name'));
            } while (this.match(TokenKind.Comma));
        }
        this.consume(TokenKind.CloseParen, "Expect ')' after parameters");
        this.consume(TokenKind.OpenCurly, "Expect '{' before function body");
        const body = this.parseBlock();
        return new FunctionStmt(name, params, body);
    }
    parseBlock() {
        const statements = [];
        while (!this.check(TokenKind.CloseCurly) && !this.isAtEnd()) {
            statements.push(this.parseStmt());
        }
        this.consume(TokenKind.CloseCurly, "Expect '}' after block");
        return statements;
    }
    parseExpression() {
        return this.parseAddition();
    }
    parseAddition() {
        let expr = this.parseMultiplication();
        while (this.match(TokenKind.Plus, TokenKind.Minus)) {
            const operator = this.previous();
            const right = this.parseMultiplication();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    parseMultiplication() {
        let expr = this.parseCall();
        while (this.match(TokenKind.Star, TokenKind.Slash, TokenKind.Mod)) {
            const operator = this.previous();
            const right = this.parseCall();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    parseCall() {
        let expr = this.parsePrimary();
        while (this.match(TokenKind.OpenParen)) {
            const args = [];
            if (!this.check(TokenKind.CloseParen)) {
                do {
                    args.push(this.parseExpression());
                } while (this.match(TokenKind.Comma));
            }
            this.consume(TokenKind.CloseParen, "Expect ')' after arguments");
            if (expr instanceof VariableExpr) {
                expr = new CallExpr(expr, args);
            }
            else {
                throw this.error(this.previous(), 'Can only call functions');
            }
        }
        return expr;
    }
    parsePrimary() {
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
    match(...kinds) {
        for (const kind of kinds) {
            if (this.check(kind)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(kind, message) {
        if (this.check(kind))
            return this.advance();
        throw this.error(this.peek(), message);
    }
    check(kind) {
        if (this.isAtEnd())
            return false;
        return this.peek().kind === kind;
    }
    advance() {
        if (!this.isAtEnd())
            this.currentPos++;
        return this.previous();
    }
    peek() {
        return this.tokens[this.currentPos];
    }
    previous() {
        return this.tokens[this.currentPos - 1];
    }
    isAtEnd() {
        return this.peek().kind === TokenKind.Eof;
    }
    error(token, message) {
        return new Error(`> [line ${token.line}] Error: ${message}`);
    }
}
