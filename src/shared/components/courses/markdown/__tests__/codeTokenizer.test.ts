import { describe, it, expect } from 'vitest';
import { tokenizeLine, createTokenizerState } from '../codeTokenizer';

const tokens = (line: string, lang: string, state = createTokenizerState()) =>
  tokenizeLine(line, lang, state).map((t) => ({ type: t.type, value: t.value }));

describe('codeTokenizer — python', () => {
  it('colours comments and f-strings', () => {
    expect(tokens('# a comment', 'python')).toEqual([{ type: 'comment', value: '# a comment' }]);

    const fstring = tokens('name = f"hi {user}"', 'python');
    expect(fstring).toContainEqual({ type: 'string', value: 'f"hi {user}"' });
    expect(fstring).toContainEqual({ type: 'plain', value: '=' });
  });

  it('tracks triple-quoted docstrings across lines', () => {
    const state = createTokenizerState();
    expect(tokens('"""Doc string starts', 'python', state)).toEqual([
      { type: 'string', value: '"""Doc string starts' },
    ]);
    expect(state.multilineString).toBe('"""');

    expect(tokens('still inside the docstring', 'python', state)).toEqual([
      { type: 'string', value: 'still inside the docstring' },
    ]);

    expect(tokens('ends here"""', 'python', state)).toEqual([
      { type: 'string', value: 'ends here"""' },
    ]);
    expect(state.multilineString).toBeNull();
  });

  it('classifies keywords, builtins and def names', () => {
    expect(tokens('def scan(host):', 'python')).toContainEqual({ type: 'keyword', value: 'def' });
    expect(tokens('def scan(host):', 'python')).toContainEqual({ type: 'func', value: 'scan' });
    expect(tokens('print(host)', 'python')).toContainEqual({ type: 'builtin', value: 'print' });
  });
});

describe('codeTokenizer — http', () => {
  it('colours request line, headers and status line', () => {
    expect(tokens('GET /admin HTTP/1.1', 'http')).toEqual([
      { type: 'keyword', value: 'GET' },
      { type: 'plain', value: ' ' },
      { type: 'path', value: '/admin' },
      { type: 'plain', value: ' ' },
      { type: 'comment', value: 'HTTP/1.1' },
      { type: 'plain', value: '' },
    ]);

    expect(tokens('Host: example.com', 'http')).toEqual([
      { type: 'type', value: 'Host' },
      { type: 'plain', value: ': ' },
      { type: 'string', value: 'example.com' },
    ]);

    expect(tokens('HTTP/1.1 200 OK', 'http')).toEqual([
      { type: 'comment', value: 'HTTP/1.1' },
      { type: 'plain', value: ' ' },
      { type: 'keyword', value: '200' },
      { type: 'string', value: ' OK' },
    ]);
  });
});

describe('codeTokenizer — sql', () => {
  it('is case-insensitive and colours comments', () => {
    const line = tokens("select * from users -- grab all", 'sql');
    expect(line).toContainEqual({ type: 'keyword', value: 'select' });
    expect(line).toContainEqual({ type: 'keyword', value: 'from' });
    expect(line).toContainEqual({ type: 'comment', value: '-- grab all' });
  });
});

describe('codeTokenizer — cmd', () => {
  it('colours commands and percent variables', () => {
    expect(tokens('DIR C:\\Users', 'cmd')).toContainEqual({ type: 'keyword', value: 'DIR' });
    expect(tokens('echo %PATH%', 'cmd')).toContainEqual({ type: 'builtin', value: '%PATH%' });
  });
});

describe('codeTokenizer — javascript', () => {
  it('colours keywords and strings', () => {
    const line = tokens('const x = "hi";', 'javascript');
    expect(line).toContainEqual({ type: 'keyword', value: 'const' });
    expect(line).toContainEqual({ type: 'string', value: '"hi"' });
  });
});

describe('codeTokenizer — unknown language', () => {
  it('never throws and returns plain text', () => {
    expect(tokens('foo bar baz', 'brainfuck')).toEqual([{ type: 'plain', value: 'foo bar baz' }]);
  });
});
