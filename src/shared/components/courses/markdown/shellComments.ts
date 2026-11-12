// Shell comment extraction for walkthrough code surfaces.
//
// Command blocks are authored with `#` comments explaining each step. Those
// comments are useful prose, but they make copied commands noisy and prevent
// the command itself from reading as a clean, copyable example. This module
// separates the two: the returned `code` is safe to copy, and `comments` can be
// rendered as regular explanatory text beside the block.

export interface ShellComment {
  /** Original line number (1-based) where the comment appeared. */
  line: number;
  /** Comment text with the leading `#` and surrounding whitespace removed. */
  text: string;
}

export interface ShellCodeParts {
  /** Command code with non-shebang comments removed. */
  code: string;
  comments: ShellComment[];
}

const SHELL_LANGUAGES = new Set(['bash', 'sh', 'shell', 'zsh', 'console', 'terminal']);

export function isShellLanguage(language?: string): boolean {
  return SHELL_LANGUAGES.has((language?.trim() || 'bash').toLowerCase());
}

/**
 * Return the index of the first unquoted `#` that starts a shell comment.
 * A `#` only starts a comment at the beginning of a word, so values such as
 * `${#var}`, `$#`, and URL fragments remain untouched.
 */
export function findCommentIndex(line: string): number {
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\' && quote !== "'") {
      escaped = true;
      continue;
    }

    if (quote) {
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '#' && (i === 0 || /[\s;|&()]/.test(line[i - 1]))) {
      return i;
    }
  }

  return -1;
}

/**
 * Split shell code into copyable command code and explanatory comments.
 *
 * Shebang lines are preserved in the code because they are executable syntax,
 * not explanatory prose. Comment-only lines are omitted from the code surface
 * so commands stay adjacent and easy to copy.
 */
export function extractShellComments(code: string): ShellCodeParts {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const comments: ShellComment[] = [];
  const kept: string[] = [];
  const firstContentLine = lines.findIndex((line) => line.trim().length > 0);

  lines.forEach((line, index) => {
    const isShebang = index === firstContentLine && /^\s*#!/.test(line);
    if (isShebang) {
      kept.push(line);
      return;
    }

    const commentIndex = findCommentIndex(line);
    if (commentIndex < 0) {
      kept.push(line);
      return;
    }

    const command = line.slice(0, commentIndex).replace(/\s+$/, '');
    const text = line.slice(commentIndex + 1).trim();

    if (command.trim()) kept.push(command);
    if (text) comments.push({ line: index + 1, text });
  });

  // Drop leading/trailing blank lines left behind by stripped comments.
  while (kept.length > 0 && kept[0].trim() === '') kept.shift();
  while (kept.length > 0 && kept[kept.length - 1].trim() === '') kept.pop();

  return { code: kept.join('\n'), comments };
}
