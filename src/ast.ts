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

export class VariableExpr implements Expr {
  name: Token;

  constructor(name: Token) {
    this.name = name;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class LiteralExpr implements Expr {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class CallExpr implements Expr {
  callee: VariableExpr;
  args: Expr[];

  constructor(callee: VariableExpr, args: Expr[]) {
    this.callee = callee;
    this.args = args;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class PrintStmt implements Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}

export class VarStmt implements Stmt {
  name: Token;
  initializer: Expr | null;

  constructor(name: Token, initializer: Expr | null) {
    this.name = name;
    this.initializer = initializer;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}

export class FunctionStmt implements Stmt {
  name: Token;
  params: Token[];
  body: Stmt[];

  constructor(name: Token, params: Token[], body: Stmt[]) {
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitFunctionStmt(this);
  }
}

export class BlockStmt implements Stmt {
  statements: Stmt[];

  constructor(statements: Stmt[]) {
    this.statements = statements;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBlockStmt(this);
  }
}

export class ExpressionStmt implements Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExpressionStmt(this);
  }
}

export class ReturnStmt implements Stmt {
  value: Expr | null;

  constructor(value: Expr | null) {
    this.value = value;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitReturnStmt(this);
  }
}
