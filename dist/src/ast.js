export class VariableExpr {
    name;
    constructor(name) {
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}
export class LiteralExpr {
    value;
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
export class CallExpr {
    callee;
    args;
    constructor(callee, args) {
        this.callee = callee;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}
export class BinaryExpr {
    left;
    operator;
    right;
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
export class PrintStmt {
    expression;
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}
export class VarStmt {
    name;
    initializer;
    constructor(name, initializer) {
        this.name = name;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}
export class FunctionStmt {
    name;
    params;
    body;
    constructor(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}
export class BlockStmt {
    statements;
    constructor(statements) {
        this.statements = statements;
    }
    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}
export class ExpressionStmt {
    expression;
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
export class ReturnStmt {
    value;
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitReturnStmt(this);
    }
}
