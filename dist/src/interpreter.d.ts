import { BinaryExpr, FunctionStmt, ReturnStmt, type BlockStmt, type CallExpr, type ExpressionStmt, type ExprVisitor, type LiteralExpr, type PrintStmt, type Stmt, type StmtVisitor, type VariableExpr, type VarStmt } from './ast.js';
export declare class Interpreter implements ExprVisitor<any>, StmtVisitor<void> {
    private environment;
    interpret(statements: Stmt[]): void;
    private execute;
    visitPrintStmt(stmt: PrintStmt): void;
    private toDevanagariString;
    private numberToDevanagari;
    visitVarStmt(stmt: VarStmt): void;
    visitFunctionStmt(stmt: FunctionStmt): void;
    visitBlockStmt(stmt: BlockStmt): void;
    visitExpressionStmt(stmt: ExpressionStmt): void;
    visitReturnStmt(stmt: ReturnStmt): void;
    visitLiteralExpr(expr: LiteralExpr): any;
    private isDevanagariNumber;
    private devanagariToNumber;
    visitVariableExpr(expr: VariableExpr): any;
    visitCallExpr(expr: CallExpr): any;
    visitBinaryExpr(expr: BinaryExpr): any;
    private toNumber;
    private evaluate;
}
