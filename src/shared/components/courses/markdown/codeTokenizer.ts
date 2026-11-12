// Unified, dependency-free line-based code tokenizer for every fenced code
// surface in the product (learning cards, command/terminal blocks, breakdowns).
//
// It is intentionally small: one scanner driven by a per-language config, with
// state carried across lines for block comments and multiline strings. Unknown
// languages never throw — they fall through to a single plain token.

export type CodeTokenType =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'flag'
  | 'path'
  | 'func'
  | 'type'
  | 'builtin'
  | 'plain';

export interface CodeToken {
  type: CodeTokenType;
  value: string;
}

/** Cross-line parser state (block comments, triple-quoted strings). */
export interface TokenizerState {
  /** Closing delimiter of an open block comment (the C-style star-slash). */
  blockComment: string | null;
  /** Opening delimiter of an open multiline string, e.g. a triple quote. */
  multilineString: string | null;
}

export function createTokenizerState(): TokenizerState {
  return { blockComment: null, multilineString: null };
}

interface LangConfig {
  lineComment: string[];
  blockComment?: Array<[string, string]>;
  strings: string[];
  tripleStrings?: string[];
  keywords: Set<string>;
  types?: Set<string>;
  builtins?: Set<string>;
  caseInsensitive?: boolean;
  /** `Verb-Noun` cmdlets / `--flags` treated as function/flag tokens. */
  dashFunc?: boolean;
  dollarVar?: boolean;
  percentVar?: boolean;
  decorators?: boolean;
}

const set = (s: string, sep = ' ') => new Set(s.split(sep).filter(Boolean));
const setLower = (s: string, sep = ' ') => new Set(s.split(sep).filter(Boolean).map((w) => w.toLowerCase()));

const PYTHON: LangConfig = {
  lineComment: ['#'],
  tripleStrings: ['"""', "'''"],
  strings: ['"', "'"],
  decorators: true,
  keywords: set(
    'def class return if elif else for while in not and or is None True False import from as with try except finally raise pass break continue lambda global nonlocal yield async await del assert match case',
  ),
  builtins: set(
    'print len range int str float bool list dict set tuple open input type enumerate zip map filter sum max min abs sorted isinstance super bytes bytearray hex ord chr repr format dir getattr setattr hasattr id hash iter next all any round pow divmod callable exec eval globals locals vars isinstance issubclass object Exception ValueError TypeError KeyError IndexError self',
  ),
  types: set('int str float bool list dict set tuple bytes bytearray object type'),
};

const JAVASCRIPT: LangConfig = {
  lineComment: ['//'],
  blockComment: [['/*', '*/']],
  strings: ['"', "'", '`'],
  keywords: set(
    'const let var function return if else for while do switch case break continue new class extends super this import export from default async await try catch finally throw typeof instanceof in of delete void yield static get set interface type enum implements public private protected readonly namespace declare as satisfies',
  ),
  builtins: set(
    'console document window globalThis Math JSON Object Array String Number Boolean Promise fetch setTimeout setInterval clearTimeout require module exports process Symbol Map Set WeakMap WeakSet RegExp Error Date',
  ),
  types: set('string number boolean any void unknown never object undefined null true false'),
};

const SQL: LangConfig = {
  caseInsensitive: true,
  lineComment: ['--'],
  blockComment: [['/*', '*/']],
  strings: ["'", '"', '`'],
  keywords: setLower(
    'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DATABASE DROP ALTER JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT NULL IS IN LIKE BETWEEN ORDER BY GROUP HAVING LIMIT OFFSET UNION ALL DISTINCT PRIMARY KEY FOREIGN REFERENCES INDEX DEFAULT CONSTRAINT EXEC EXECUTE PROCEDURE DECLARE BEGIN END IF ELSE WHILE CASE WHEN THEN GRANT REVOKE USE SHOW DESCRIBE EXPLAIN TRUNCATE REPLACE INTO UNIQUE CHECK CASCADE ASC DESC EXISTS ANY SOME',
  ),
  builtins: setLower('COUNT SUM AVG MIN MAX NOW LENGTH UPPER LOWER SUBSTRING CONCAT COALESCE CAST ROUND GETDATE'),
};

const CMD: LangConfig = {
  caseInsensitive: true,
  lineComment: ['REM ', '::'],
  strings: ['"'],
  percentVar: true,
  keywords: setLower(
    'DIR CD COPY MOVE DEL ERASE ECHO SET IF ELSE FOR GOTO CALL START CLS EXIT TYPE FIND FINDSTR NET IPCONFIG PING TRACERT NSLOOKUP TASKLIST TASKKILL SC REG WHOAMI SYSTEMINFO NETSTAT CHKDSK ROBOCOPY XCOPY ATTRIB MD RD REN RENAME PAUSE TITLE COLOR PATH SETLOCAL ENDLOCAL SHIFT PUSHD POPD',
  ),
};

const POWERSHELL: LangConfig = {
  caseInsensitive: true,
  lineComment: ['#'],
  blockComment: [['<#', '#>']],
  strings: ['"', "'"],
  dollarVar: true,
  dashFunc: true,
  keywords: setLower(
    'if else elseif foreach for while do switch function param return break continue try catch finally throw class enum begin process end filter in not and or',
  ),
  builtins: setLower(
    'Write-Output Write-Host Get-ChildItem Get-Item Get-Content Set-Content Add-Content Remove-Item Copy-Item Move-Item New-Item Get-Command Get-Help Get-Process Stop-Process Start-Process Select-Object Where-Object ForEach-Object Sort-Object Measure-Object Out-File Out-String ConvertTo-Json ConvertFrom-Json Invoke-WebRequest Invoke-Expression Test-Path Test-Connection Get-Service Start-Service Stop-Service Get-EventLog Get-LocalUser New-LocalUser',
  ),
};

const PHP: LangConfig = {
  lineComment: ['//', '#'],
  blockComment: [['/*', '*/']],
  strings: ['"', "'"],
  dollarVar: true,
  keywords: set(
    'function class echo if else elseif foreach for while do switch case break continue return new public private protected static extends implements namespace use require require_once include include_once try catch finally throw global var const as instanceof and or xor not',
  ),
  builtins: set(
    'print isset unset empty die exit array count strlen str_replace preg_match preg_replace implode explode json_encode json_decode var_dump print_r header mysqli_query sprintf trim substr strpos in_array array_map array_filter in_array intval floatval is_array is_string',
  ),
};

const JAVA: LangConfig = {
  lineComment: ['//'],
  blockComment: [['/*', '*/']],
  strings: ['"', "'"],
  keywords: set(
    'public private protected class interface extends implements static final void int long double float boolean char byte short new return if else for while do switch case break continue try catch finally throw throws import package this super abstract synchronized volatile transient native instanceof enum assert null true false var record',
  ),
  types: set('String Integer Long Double Float Boolean Character Byte Short Object List Map Set ArrayList HashMap'),
  builtins: set('System out println print printf err main'),
};

const LUA: LangConfig = {
  lineComment: ['--'],
  blockComment: [['--[[', ']]']],
  strings: ['"', "'"],
  keywords: set(
    'function end local if then else elseif for while do repeat until return break in and or not nil true false goto',
  ),
  builtins: set(
    'print type tostring tonumber pairs ipairs table string math io os require setmetatable getmetatable pcall xpcall error assert select next rawget rawset coroutine',
  ),
};

const LANGS: Record<string, LangConfig> = {
  python: PYTHON,
  py: PYTHON,
  javascript: JAVASCRIPT,
  js: JAVASCRIPT,
  typescript: JAVASCRIPT,
  ts: JAVASCRIPT,
  jsx: JAVASCRIPT,
  tsx: JAVASCRIPT,
  sql: SQL,
  mysql: SQL,
  postgres: SQL,
  postgresql: SQL,
  sqlite: SQL,
  cmd: CMD,
  batch: CMD,
  bat: CMD,
  dos: CMD,
  powershell: POWERSHELL,
  ps: POWERSHELL,
  ps1: POWERSHELL,
  php: PHP,
  java: JAVA,
  lua: LUA,
};

export function normalizeLanguage(language?: string): string {
  return (language?.trim() || '').toLowerCase().split(/[\s:]/)[0];
}

const IDENT_START = /[A-Za-z_]/;
const IDENT_CHAR = /[A-Za-z0-9_]/;

function classifyWord(word: string, cfg: LangConfig, after: string): CodeTokenType {
  const key = cfg.caseInsensitive ? word.toLowerCase() : word;
  if (cfg.keywords.has(key)) return 'keyword';
  if (cfg.types?.has(key)) return 'type';
  if (cfg.builtins?.has(key)) return 'builtin';
  if (cfg.dashFunc && word.includes('-') && /^[A-Za-z]/.test(word)) return 'func';
  if (/^\s*\(/.test(after)) return 'func';
  if (/^[A-Z]/.test(word)) return 'type';
  return 'plain';
}

/** Scan one line of a generic language. Mutates `state`. */
function tokenizeGeneric(line: string, cfg: LangConfig, state: TokenizerState): CodeToken[] {
  const tokens: CodeToken[] = [];
  const push = (type: CodeTokenType, value: string) => {
    if (value) tokens.push({ type, value });
  };

  // Resume an open block comment.
  if (state.blockComment) {
    const close = state.blockComment;
    const idx = line.indexOf(close);
    if (idx === -1) {
      push('comment', line);
      return tokens;
    }
    push('comment', line.slice(0, idx + close.length));
    state.blockComment = null;
    line = line.slice(idx + close.length);
  }

  // Resume an open multiline string.
  if (state.multilineString) {
    const close = state.multilineString;
    const idx = line.indexOf(close);
    if (idx === -1) {
      push('string', line);
      return tokens;
    }
    push('string', line.slice(0, idx + close.length));
    state.multilineString = null;
    line = line.slice(idx + close.length);
  }

  let i = 0;
  const len = line.length;

  while (i < len) {
    const ch = line[i];

    if (/\s/.test(ch)) {
      let j = i;
      while (j < len && /\s/.test(line[j])) j += 1;
      push('plain', line.slice(i, j));
      i = j;
      continue;
    }

    // Line comments (case-insensitive languages match the raw prefix loosely).
    let matchedLine = false;
    for (const lc of cfg.lineComment) {
      const hit = cfg.caseInsensitive
        ? line.slice(i).toLowerCase().startsWith(lc.toLowerCase())
        : line.startsWith(lc, i);
      if (hit && (lc.endsWith(' ') || i === 0 || /\s/.test(line[i - 1]))) {
        push('comment', line.slice(i));
        i = len;
        matchedLine = true;
        break;
      }
    }
    if (matchedLine) break;

    // Block comments.
    if (cfg.blockComment) {
      let matched = false;
      for (const [open, close] of cfg.blockComment) {
        if (line.startsWith(open, i)) {
          const idx = line.indexOf(close, i + open.length);
          if (idx === -1) {
            push('comment', line.slice(i));
            state.blockComment = close;
            i = len;
          } else {
            push('comment', line.slice(i, idx + close.length));
            i = idx + close.length;
          }
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    // Decorators (python).
    if (cfg.decorators && ch === '@' && IDENT_START.test(line[i + 1] ?? '')) {
      let j = i + 1;
      while (j < len && (IDENT_CHAR.test(line[j]) || line[j] === '.')) j += 1;
      push('func', line.slice(i, j));
      i = j;
      continue;
    }

    // Dollar / percent variables.
    if (cfg.dollarVar && ch === '$' && IDENT_START.test(line[i + 1] ?? '')) {
      let j = i + 1;
      while (j < len && (IDENT_CHAR.test(line[j]) || line[j] === ':')) j += 1;
      push('builtin', line.slice(i, j));
      i = j;
      continue;
    }
    if (cfg.percentVar && ch === '%') {
      const end = line.indexOf('%', i + 1);
      if (end > i) {
        push('builtin', line.slice(i, end + 1));
        i = end + 1;
        continue;
      }
    }

    // Prefixed / triple-quoted strings.
    const tripleHit = cfg.tripleStrings?.find((t) => line.startsWith(t, i));
    if (tripleHit) {
      const idx = line.indexOf(tripleHit, i + tripleHit.length);
      if (idx === -1) {
        push('string', line.slice(i));
        state.multilineString = tripleHit;
        i = len;
      } else {
        push('string', line.slice(i, idx + tripleHit.length));
        i = idx + tripleHit.length;
      }
      continue;
    }

    // f-strings / raw strings / byte strings (prefix + quote).
    const prefixMatch = line.slice(i).match(/^([rRbBuUfF]{1,3})(["'])/);
    if (prefixMatch && (cfg.strings.includes(prefixMatch[2]))) {
      const quote = prefixMatch[2];
      const start = i + prefixMatch[1].length;
      let j = start + 1;
      let escaped = false;
      while (j < len) {
        const c = line[j];
        if (escaped) {
          escaped = false;
          j += 1;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          j += 1;
          continue;
        }
        if (c === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      push('string', line.slice(i, j));
      i = j;
      continue;
    }

    // Plain strings.
    if (cfg.strings.includes(ch)) {
      let j = i + 1;
      let escaped = false;
      while (j < len) {
        const c = line[j];
        if (escaped) {
          escaped = false;
          j += 1;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          j += 1;
          continue;
        }
        if (c === ch) {
          j += 1;
          break;
        }
        j += 1;
      }
      push('string', line.slice(i, j));
      i = j;
      continue;
    }

    // Numbers.
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(line[i + 1] ?? ''))) {
      let j = i;
      if (/^0[xX]/.test(line.slice(i))) {
        j = i + 2;
        while (j < len && /[0-9a-fA-F_]/.test(line[j])) j += 1;
      } else if (/^0[bB]/.test(line.slice(i))) {
        j = i + 2;
        while (j < len && /[01_]/.test(line[j])) j += 1;
      } else {
        while (j < len && /[0-9._]/.test(line[j])) j += 1;
        if (line[j] === 'e' || line[j] === 'E') {
          let k = j + 1;
          if (line[k] === '+' || line[k] === '-') k += 1;
          if (/\d/.test(line[k] ?? '')) {
            j = k;
            while (j < len && /\d/.test(line[j])) j += 1;
          }
        }
      }
      push('number', line.slice(i, j));
      i = j;
      continue;
    }

    // Flags / options.
    if (ch === '-' && /[A-Za-z]/.test(line[i + 1] ?? '')) {
      let j = i + 1;
      while (j < len && /[A-Za-z0-9_-]/.test(line[j])) j += 1;
      push('flag', line.slice(i, j));
      i = j;
      continue;
    }

    // Identifiers / keywords.
    if (IDENT_START.test(ch)) {
      let j = i;
      while (j < len && (IDENT_CHAR.test(line[j]) || line[j] === '-' || line[j] === '.')) {
        // Stop hyphen/dot runs at a non-identifier boundary.
        if ((line[j] === '-' || line[j] === '.') && !IDENT_CHAR.test(line[j + 1] ?? '')) break;
        j += 1;
      }
      const word = line.slice(i, j);
      push(classifyWord(word, cfg, line.slice(j)), word);
      i = j;
      continue;
    }

    // Absolute paths.
    if (ch === '/' && IDENT_CHAR.test(line[i + 1] ?? '')) {
      let j = i + 1;
      while (j < len && /[A-Za-z0-9_./~-]/.test(line[j])) j += 1;
      push('path', line.slice(i, j));
      i = j;
      continue;
    }

    // Anything else is plain punctuation.
    push('plain', ch);
    i += 1;
  }

  return tokens;
}

/** HTTP request/response surface. */
function tokenizeHttp(line: string): CodeToken[] {
  const requestMatch = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|TRACE|CONNECT)(\s+)(\S+)(\s+)(HTTP\/[\d.]+)(.*)$/);
  if (requestMatch) {
    return [
      { type: 'keyword', value: requestMatch[1] },
      { type: 'plain', value: requestMatch[2] },
      { type: 'path', value: requestMatch[3] },
      { type: 'plain', value: requestMatch[4] },
      { type: 'comment', value: requestMatch[5] },
      { type: 'plain', value: requestMatch[6] },
    ];
  }

  const statusMatch = line.match(/^(HTTP\/[\d.]+)(\s+)(\d{3})(.*)$/);
  if (statusMatch) {
    return [
      { type: 'comment', value: statusMatch[1] },
      { type: 'plain', value: statusMatch[2] },
      { type: 'keyword', value: statusMatch[3] },
      { type: 'string', value: statusMatch[4] },
    ];
  }

  const headerMatch = line.match(/^([A-Za-z0-9-]+)(:\s*)(.*)$/);
  if (headerMatch) {
    return [
      { type: 'type', value: headerMatch[1] },
      { type: 'plain', value: headerMatch[2] },
      { type: 'string', value: headerMatch[3] },
    ];
  }

  return [{ type: 'plain', value: line }];
}

/** Minimal HTML/XML surface: tag names, attribute names and quoted values. */
function tokenizeHtml(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const re = /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z][\w-]*)|([A-Za-z-]+)(=)("[^"]*"|'[^']*')|(\/?>)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push({ type: 'plain', value: line.slice(last, m.index) });
    if (m[1]) tokens.push({ type: 'comment', value: m[1] });
    else if (m[2]) {
      tokens.push({ type: 'plain', value: m[2] });
      tokens.push({ type: 'keyword', value: m[3] });
    } else if (m[4]) {
      tokens.push({ type: 'type', value: m[4] });
      tokens.push({ type: 'plain', value: m[5] });
      tokens.push({ type: 'string', value: m[6] });
    } else if (m[7]) tokens.push({ type: 'plain', value: m[7] });
    last = re.lastIndex;
  }
  if (last < line.length) tokens.push({ type: 'plain', value: line.slice(last) });
  return tokens;
}

/** Minimal JSON surface. */
function tokenizeJsonLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push({ type: 'plain', value: line.slice(last, m.index) });
    if (m[1]) {
      tokens.push({ type: m[2] ? 'type' : 'string', value: m[1] });
      if (m[2]) tokens.push({ type: 'plain', value: m[2] });
    } else if (m[3]) tokens.push({ type: 'number', value: m[3] });
    else if (m[4]) tokens.push({ type: 'keyword', value: m[4] });
    else if (m[5]) tokens.push({ type: 'plain', value: m[5] });
    last = re.lastIndex;
  }
  if (last < line.length) tokens.push({ type: 'plain', value: line.slice(last) });
  return tokens;
}

/**
 * Tokenize one line. Shell languages should be routed through the existing
 * `bashTokenizer` by the caller; this handles everything else.
 */
export function tokenizeLine(line: string, lang: string, state: TokenizerState): CodeToken[] {
  const key = normalizeLanguage(lang);
  if (key === 'http' || key === 'https') return tokenizeHttp(line);
  if (key === 'html' || key === 'xml' || key === 'svg') return tokenizeHtml(line);
  if (key === 'json' || key === 'jsonc') return tokenizeJsonLine(line);

  const cfg = LANGS[key];
  if (!cfg) return [{ type: 'plain', value: line }];
  return tokenizeGeneric(line, cfg, state);
}

/** Tokenize a whole snippet, returning tokens grouped per source line. */
export function tokenizeLines(code: string, lang: string): CodeToken[][] {
  const state = createTokenizerState();
  return code.split('\n').map((line) => tokenizeLine(line, lang, state));
}

export const CODE_TOKEN_CLASS: Record<CodeTokenType, string> = {
  keyword: 'text-code-keyword font-bold',
  string: 'text-code-string',
  comment: 'text-code-comment italic',
  number: 'text-code-number',
  flag: 'text-code-flag',
  path: 'text-code-path',
  func: 'text-code-func',
  type: 'text-code-type',
  builtin: 'text-code-builtin',
  plain: 'text-text-primary',
};
