import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

describe('Interpreter', () => {
  function runSource(source: string): string[] {
    const lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser = new Parser(tokens);
    const stmts = parser.parse();
    const interpreter = new Interpreter();

    const outputs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      outputs.push(args.join(' '));
    };

    try {
      interpreter.interpret(stmts);
    } finally {
      console.log = originalLog;
    }

    return outputs;
  }

  test('evaluate addition with Devanagari numbers', () => {
    const source = `मानौ क = ५ + ३
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '८');
  });

  test('evaluate subtraction', () => {
    const source = `मानौ क = १० - २
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '८');
  });

  test('evaluate multiplication', () => {
    const source = `मानौ क = ४ * २
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '८');
  });

  test('evaluate division', () => {
    const source = `मानौ क = १५ / ३
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '५');
  });

  test('evaluate modulo', () => {
    const source = `मानौ क = १७ % ५
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '२');
  });

  test('evaluate operator precedence', () => {
    const source = `मानौ क = २ + ३ * ४
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '१४');
  });

  test('evaluate parentheses grouping', () => {
    const source = `मानौ क = (२ + ३) * ४
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '२०');
  });

  test('evaluate chained addition', () => {
    const source = `मानौ क = १ + २ + ३
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '६');
  });

  test('evaluate mixed operations', () => {
    const source = `मानौ क = १० - ३ * २ + ४
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '८');
  });

  test('evaluate division by zero throws error', () => {
    const source = `मानौ क = १० / ०
छाप(क)`;
    assert.throws(() => {
      runSource(source);
    }, /Division by zero/);
  });

  test('evaluate modulo by zero throws error', () => {
    const source = `मानौ क = १० % ०
छाप(क)`;
    assert.throws(() => {
      runSource(source);
    }, /Modulo by zero/);
  });

  test('evaluate complex expression', () => {
    const source = `मानौ क = (५ + ५) * (३ - १)
छाप(क)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '२०');
  });

  test('evaluate multiple print statements', () => {
    const source = `मानौ क = ५ + ५
छाप(क)
मानौ ख = क + ५
छाप(ख)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 2);
    assert.equal(outputs[0], '१०');
    assert.equal(outputs[1], '१५');
  });

  test('print string literal', () => {
    const source = `छाप("नमस्ते")`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], 'नमस्ते');
  });

  test('function returns value', () => {
    const source = `कार्य जोड(क, ख) {
  फिर्ता क + ख
}
मानौ परिणाम = जोड(२, ३)
छाप(परिणाम)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '५');
  });

  test('function returns expression result', () => {
    const source = `कार्य गुणा(क, ख) {
  फिर्ता क * ख + १०
}
मानौ परिणाम = गुणा(३, ४)
छाप(परिणाम)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], '२२');
  });

  test('function returns string', () => {
    const source = `कार्य नमस्कार() {
  फिर्ता "नमस्ते संसार"
}
मानौ सन्देश = नमस्कार()
छाप(सन्देश)`;
    const outputs = runSource(source);
    assert.equal(outputs.length, 1);
    assert.equal(outputs[0], 'नमस्ते संसार');
  });
});
