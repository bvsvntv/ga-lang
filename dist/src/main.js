import { readFileSync } from 'node:fs';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';
function getFileNameFromArgs(args) {
    if (args.length <= 0) {
        console.log('> No input files.');
    }
    if (args.length > 1) {
        console.log('> Too many arguments.');
    }
    const fileName = args[0] || null;
    return fileName;
}
function execFile(path) {
    const source = readFileSync(path, 'utf-8');
    const lexer = new Lexer(source);
    const tokens = lexer.readTokens();
    const parser = new Parser(tokens);
    const stmts = parser.parse();
    const interpreter = new Interpreter();
    interpreter.interpret(stmts);
}
function main() {
    const fileName = getFileNameFromArgs(process.argv.slice(2));
    if (fileName !== null) {
        execFile(fileName);
    }
}
main();
