import type { Token } from './token.js';
export interface Expr {
    accept<T>(visitor: ExprVisitor<T>): T;
}
export interface ExprVisitor<T> {
    visitVariableExpr(expr: VariableExpr): T;
    visitLiteralExpr(expr: LiteralExpr): T;
    visitCallExpr(expr: CallExpr): T;
    visitBinaryExpr(expr: BinaryExpr): T;
}
export interface Stmt {
    accept<T>(visitor: StmtVisitor<T>): T;
}
export interface StmtVisitor<T> {
    visitPrintStmt(stmt: PrintStmt): T;
    visitVarStmt(stmt: VarStmt): T;
    visitFunctionStmt(stmt: FunctionStmt): T;
    visitBlockStmt(stmt: BlockStmt): T;
    visitExpressionStmt(stmt: ExpressionStmt): T;
    visitReturnStmt(stmt: ReturnStmt): T;
}
export declare class VariableExpr implements Expr {
    name: Token;
    constructor(name: Token);
    accept<T>(visitor: ExprVisitor<T>): T;
}
export declare class LiteralExpr implements Expr {
    value: any;
    constructor(value: any);
    accept<T>(visitor: ExprVisitor<T>): T;
}
export declare class CallExpr implements Expr {
    callee: VariableExpr;
    args: Expr[];
    constructor(callee: VariableExpr, args: Expr[]);
    accept<T>(visitor: ExprVisitor<T>): T;
}
export declare class BinaryExpr implements Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr);
    accept<T>(visitor: ExprVisitor<T>): T;
}
export declare class PrintStmt implements Stmt {
    expression: Expr;
    constructor(expression: Expr);
    accept<T>(visitor: StmtVisitor<T>): T;
}
export declare class VarStmt implements Stmt {
    name: Token;
    initializer: Expr | null;
    constructor(name: Token, initializer: Expr | null);
    accept<T>(visitor: StmtVisitor<T>): T;
}
export declare class FunctionStmt implements Stmt {
    name: Token;
    params: Token[];
    body: Stmt[];
    constructor(name: Token, params: Token[], body: Stmt[]);
    accept<T>(visitor: StmtVisitor<T>): T;
}
export declare class BlockStmt implements Stmt {
    statements: Stmt[];
    constructor(statements: Stmt[]);
    accept<T>(visitor: StmtVisitor<T>): T;
}
export declare class ExpressionStmt implements Stmt {
    expression: Expr;
    constructor(expression: Expr);
    accept<T>(visitor: StmtVisitor<T>): T;
}
export declare class ReturnStmt implements Stmt {
    value: Expr | null;
    constructor(value: Expr | null);
    accept<T>(visitor: StmtVisitor<T>): T;
}
