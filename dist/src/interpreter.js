import { BinaryExpr, FunctionStmt, ReturnStmt } from './ast.js';
import { TokenKind } from './token.js';
class ReturnValue extends Error {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export class Interpreter {
    environment = new Map();
    interpret(statements) {
        for (const statement of statements) {
            this.execute(statement);
        }
    }
    execute(stmt) {
        stmt.accept(this);
    }
    /*
     * Process print statement
     */
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(this.toDevanagariString(value));
    }
    toDevanagariString(value) {
        if (typeof value === 'number') {
            return this.numberToDevanagari(value);
        }
        return String(value);
    }
    numberToDevanagari(num) {
        const devanagariZero = 0x0966;
        return num
            .toString()
            .split('')
            .map((char) => {
            if (char >= '0' && char <= '9') {
                return String.fromCharCode(devanagariZero + parseInt(char));
            }
            return char;
        })
            .join('');
    }
    visitVarStmt(stmt) {
        const value = stmt.initializer !== null ? this.evaluate(stmt.initializer) : null;
        this.environment.set(stmt.name.lexeme, value);
    }
    visitFunctionStmt(stmt) {
        this.environment.set(stmt.name.lexeme, stmt);
    }
    visitBlockStmt(stmt) {
        for (const statement of stmt.statements) {
            this.execute(statement);
        }
    }
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
    }
    visitReturnStmt(stmt) {
        const value = stmt.value !== null ? this.evaluate(stmt.value) : null;
        throw new ReturnValue(value);
    }
    visitLiteralExpr(expr) {
        if (typeof expr.value === 'string' && expr.value.startsWith('"')) {
            return expr.value.slice(1, -1);
        }
        // Check if it's a Devanagari number and convert it
        if (typeof expr.value === 'string' && this.isDevanagariNumber(expr.value)) {
            return this.devanagariToNumber(expr.value);
        }
        return expr.value;
    }
    isDevanagariNumber(value) {
        if (value.length === 0)
            return false;
        for (const char of value) {
            const code = char.charCodeAt(0);
            if (code < 0x0966 || code > 0x096f) {
                return false;
            }
        }
        return true;
    }
    devanagariToNumber(value) {
        const devanagariZero = 0x0966;
        let num = 0;
        for (const char of value) {
            const code = char.charCodeAt(0);
            num = num * 10 + (code - devanagariZero);
        }
        return num;
    }
    visitVariableExpr(expr) {
        const value = this.environment.get(expr.name.lexeme);
        if (value === undefined) {
            throw new Error(`Undefined variable '${expr.name.lexeme}'`);
        }
        return value;
    }
    visitCallExpr(expr) {
        const func = this.environment.get(expr.callee.name.lexeme);
        if (func === undefined) {
            throw new Error(`Undefined function '${expr.callee.name.lexeme}'`);
        }
        if (!(func instanceof FunctionStmt)) {
            throw new Error(`'${expr.callee.name.lexeme}' is not a function`);
        }
        // Create new environment for function scope
        const prevEnvironment = this.environment;
        this.environment = new Map(this.environment);
        // Bind arguments to parameters
        if (expr.args.length !== func.params.length) {
            throw new Error(`Expected ${func.params.length} arguments but got ${expr.args.length}`);
        }
        for (let i = 0; i < func.params.length; i++) {
            const value = this.evaluate(expr.args[i]);
            this.environment.set(func.params[i].lexeme, value);
        }
        // Execute function body
        try {
            for (const stmt of func.body) {
                this.execute(stmt);
            }
        }
        catch (returnValue) {
            if (returnValue instanceof ReturnValue) {
                // Restore previous environment before returning
                this.environment = prevEnvironment;
                return returnValue.value;
            }
            throw returnValue;
        }
        // Restore previous environment
        this.environment = prevEnvironment;
        return null;
    }
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        // Convert Devanagari digits to regular numbers for arithmetic
        const leftNum = this.toNumber(left);
        const rightNum = this.toNumber(right);
        switch (expr.operator.kind) {
            case TokenKind.Plus:
                // Handle string concatenation or numeric addition
                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }
                return leftNum + rightNum;
            case TokenKind.Minus:
                return leftNum - rightNum;
            case TokenKind.Star:
                return leftNum * rightNum;
            case TokenKind.Slash:
                if (rightNum === 0) {
                    throw new Error('Division by zero');
                }
                return leftNum / rightNum;
            case TokenKind.Mod:
                if (rightNum === 0) {
                    throw new Error('Modulo by zero');
                }
                return leftNum % rightNum;
            default:
                throw new Error(`Unknown operator: ${expr.operator.kind}`);
        }
    }
    toNumber(value) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            // Check if it's a Devanagari number
            const devanagariZero = '\u{0966}'.charCodeAt(0); // ०
            let isDevanagari = true;
            let num = 0;
            for (const char of value) {
                const code = char.charCodeAt(0);
                if (code >= devanagariZero && code <= devanagariZero + 9) {
                    num = num * 10 + (code - devanagariZero);
                }
                else if (char >= '0' && char <= '9') {
                    isDevanagari = false;
                }
                else {
                    throw new Error(`Cannot convert '${value}' to number`);
                }
            }
            if (isDevanagari && value.length > 0)
                return num;
            // Otherwise try regular parsing
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
                throw new Error(`Cannot convert '${value}' to number`);
            }
            return parsed;
        }
        throw new Error(`Cannot convert '${value}' to number`);
    }
    /*
     * Evaluate an expression
     */
    evaluate(expr) {
        return expr.accept(this);
    }
}
