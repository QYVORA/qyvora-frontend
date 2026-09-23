// Simple tokeniser for bash/shell commands used by the fenced-code terminal
// blocks in learning Markdown (courses, labs, HPB walkthroughs).
export type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'flag' | 'path' | 'plain';

export interface Token { type: TokenType; value: string; }

const KEYWORDS = /^(sudo|apt|apt-get|pip|pip3|python|python3|bash|sh|chmod|chown|mkdir|rm|cp|mv|ls|cat|grep|find|echo|export|source|cd|pwd|whoami|id|ps|kill|netstat|ss|ping|traceroute|curl|wget|nmap|sqlmap|hydra|nc|ncat|netcat|ssh|scp|git|docker|service|systemctl|useradd|usermod|passwd|su|env|set|unset|read|exit|return|if|then|else|fi|for|do|done|while|case|esac|function|local|declare|eval|exec|trap|wait|jobs|bg|fg|alias|unalias|history|man|help|which|type|file|stat|du|df|mount|umount|lsof|strace|ltrace|gdb|objdump|strings|xxd|hexdump|base64|openssl|gpg|tar|gzip|zip|unzip|awk|sed|sort|uniq|wc|head|tail|tee|xargs|cut|tr|diff|patch|make|gcc|g\+\+|javac|java|node|npm|yarn|php|ruby|perl|go|cargo|rustc)\b/;

export function tokeniseBash(line: string): Token[] {
  const tokens: Token[] = [];

  // Comments
  if (line.trimStart().startsWith('#')) {
    tokens.push({ type: 'comment', value: line });
    return tokens;
  }

  // Tokenise word by word
  const parts = line.split(/(\s+|"[^"]*"|'[^']*'|`[^`]*`|--?[\w-]+=?[\w./]*|-[\w]+|\/[\w./~-]+|\d+)/g);

  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ type: 'plain', value: part });
    } else if (/^["'`]/.test(part)) {
      tokens.push({ type: 'string', value: part });
    } else if (/^--?[\w-]+=?/.test(part)) {
      tokens.push({ type: 'flag', value: part });
    } else if (/^\/[\w./~-]+/.test(part)) {
      tokens.push({ type: 'path', value: part });
    } else if (/^\d+$/.test(part)) {
      tokens.push({ type: 'number', value: part });
    } else if (KEYWORDS.test(part)) {
      tokens.push({ type: 'keyword', value: part });
    } else {
      tokens.push({ type: 'plain', value: part });
    }
  }

  return tokens;
}

export const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: 'text-code-keyword font-bold',
  string:  'text-code-string',
  comment: 'text-text-muted italic',
  number:  'text-code-number',
  flag:    'text-code-flag',
  path:    'text-code-path',
  plain:   'text-text-primary',
};