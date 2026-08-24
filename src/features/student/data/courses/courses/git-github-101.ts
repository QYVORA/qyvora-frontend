import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('git-1', 'What is Version Control?',
      `**Version control** tracks every change you make to your files. Think of it like a "save game" for your code, you can go back to any previous state.

Git is the most popular version control system. It's used by every major tech company and open-source project.

Without Git:
- You end up with files like \`report-final-v2-really-final-v3.docx\`
- Collaborating means emailing files back and forth
- Mistakes can't be undone

With Git:
- Every change is recorded with a message explaining what changed
- Multiple people can work on the same code simultaneously
- You can experiment on branches without breaking the main code
- Mistakes can be reverted instantly

\`\`\`bash
git --version
# Check if Git is installed
\`\`\`

> **Why this matters for hacking:** Version control isn't just for code, it's essential for security tool development, collaboration on open-source exploits, and tracking changes during engagements. Every major security framework (Metasploit, Burp extensions, Nmap scripts) lives on GitHub. Understanding Git lets you clone, modify, and contribute to the tools you'll use daily. In incident response, Git history can reveal what changed and when, crucial evidence in a breach investigation.

**Mini-challenge:** Run \`git --version\` to confirm Git is installed. Then \`git config --global user.name "Your Name"\` and \`git config --global user.email "your@email.com"\` to set up your identity. These are the first steps before any Git workflow.`),

    l('git-2', 'Your First Repository',
      `A **repository** (or "repo") is a folder that Git is watching. Let's create one.

\`\`\`bash
mkdir my-first-repo
cd my-first-repo
git init
\`\`\`

\`git init\` creates a hidden \`.git\` folder where Git stores all the tracking data.

Now create a file and track it:

\`\`\`bash
echo "# My First Repo" > README.md
git status
\`\`\`

\`\`\`
On branch master
No commits yet
Untracked files:
  README.md
\`\`\`

\`README.md\` is "untracked" - Git sees it but isn't watching it yet.

\`\`\`bash
git add README.md     # Stage the file (prepare for commit)
git status            # Now it's "staged"
git commit -m "Initial commit: add README"
\`\`\`

The **commit** saves your changes permanently. The \`-m\` flag adds a message describing what you changed. Good commit messages are short but descriptive.

\`\`\`bash
# View your commit history
git log --oneline
\`\`\`

> **Why this matters for hacking:** The \`git init\` → \`add\` → \`commit\` workflow is the foundation. Every commit creates a snapshot you can return to. In security tool development, this means you can experiment freely, if you break something, just \`git checkout\` a previous commit. The \`git log --oneline\` command shows your history at a glance. The \`.git\` folder is also a target in CTF challenges, if a website exposes its \`.git\` directory, you can download the entire repository, including commit history, credentials, and secrets.

**Mini-challenge:** Run \`mkdir /tmp/test-repo && cd /tmp/test-repo && git init && echo "# Test" > README.md && git add README.md && git commit -m "initial"\` then \`git log --oneline\`. This is the exact repo initialization workflow used for every project.`),

    l('git-3', 'Branching & Merging',
      `**Branches** let you work on different versions of your code simultaneously. The default branch is called \`main\` (or \`master\`).

\`\`\`bash
# List all branches (* shows current)
git branch

# Create a new branch
git branch feature-scanner

# Switch to the new branch
git checkout feature-scanner

# Or do both in one command
git checkout -b feature-scanner
\`\`\`

Now any changes you commit go into \`feature-scanner\`, not \`main\`. You can switch back to \`main\` anytime with \`git checkout main\`.

Once your feature is ready, **merge** it back:

\`\`\`bash
git checkout main
git merge feature-scanner
\`\`\`

If two people edited the same file differently, you'll get a **merge conflict**:

\`\`\`
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> feature-scanner
\`\`\`

Fix the conflict by editing the file, removing the markers, then:

\`\`\`bash
git add file.txt
git commit -m "Resolve merge conflict"
\`\`\`

> **Why this matters for hacking:** Branching is how open-source security tools are developed. The \`main\` branch holds stable code while feature branches contain experimental changes. Merge conflicts are common when multiple people edit the same file, resolving them correctly is a critical skill. In security research, you'll often work on branches to test exploit variants without affecting the main codebase. The \`git stash\` command is invaluable when you need to temporarily set aside changes to work on something urgent.

**Mini-challenge:** Create a branch, make a change, and merge it: \`cd /tmp/test-repo && git checkout -b feature && echo "change" >> README.md && git add README.md && git commit -m "feature change" && git checkout main && git merge feature\`. This is the exact branching workflow used in every Git project.

Branches are the superpower of Git, they let you experiment freely without fear.`),

    l('git-4', 'Working with GitHub',
      `**GitHub** is a cloud service that hosts Git repositories. It lets you back up your code, collaborate with others, and contribute to open-source projects.

First, create an account at github.com and create an empty repository.

Connect your local repo to GitHub:

\`\`\`bash
# Add GitHub as a remote (do this once)
git remote add origin https://github.com/YOUR_USERNAME/my-first-repo.git

# Push your code to GitHub
git push -u origin main
\`\`\`

The \`-u\` flag sets up tracking so future pushes can just be \`git push\`.

**Pull** to get the latest changes from GitHub:

\`\`\`bash
git pull
\`\`\`

**Clone** to download a repo for the first time:

\`\`\`bash
git clone https://github.com/username/repo.git
\`\`\`

> **Why this matters for hacking:** GitHub is where the security community lives. Every Proof of Concept (PoC) exploit, every security tool, and every vulnerability disclosure ends up on GitHub. Knowing how to \`git clone\` a tool, \`git pull\` updates, and \`git push\` your changes is essential. The \`git remote -v\` command shows which remotes are configured. In bug bounty hunting, you'll clone targets' repositories to look for hardcoded credentials, API keys, and vulnerabilities in publicly accessible code.

**Mini-challenge:** Run \`git clone https://github.com/danielmiessler/SecLists.git /tmp/seclists && cd /tmp/seclists && git log --oneline -5 && ls\` to clone a real security tool repository. SecLists is the standard wordlist collection used in every penetration test.

The standard collaboration flow:

\`\`\`bash
# 1. Get latest changes
git pull

# 2. Create a branch for your work
git checkout -b my-feature

# 3. Make changes and commit
git add .
git commit -m "Add my feature"

# 4. Push your branch to GitHub
git push -u origin my-feature

# 5. Create a Pull Request on GitHub
# 6. After merge, switch back and update
git checkout main
git pull
\`\`\``),

    l('git-5', 'Pull Requests & Collaboration',
      `A **Pull Request (PR)** is how you propose changes to a project. Instead of pushing directly to \`main\`, you push a branch and ask the maintainers to review and merge your changes.

**Forking** a repo creates your own copy under your GitHub account. This is how you contribute to projects you don't own.

\`\`\`bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/some-project.git
cd some-project

# Add the original repo as "upstream"
git remote add upstream https://github.com/ORIGINAL_OWNER/some-project.git

# Keep your fork updated
git pull upstream main
\`\`\`

**Best practices:**
- Write clear commit messages: \`"fix: handle timeout error"\` not \`"fixed stuff"\`
- Keep commits small and focused on one change
- Pull before you push to avoid conflicts
- Review your own PR before asking others to review

\`\`\`bash
# Useful Git commands cheat sheet
git status            # What's changed?
git diff              # Show unstaged changes
git log --oneline     # Compact commit history
git stash             # Temporarily save changes
git stash pop         # Restore stashed changes
git reset HEAD file   # Unstage a file
git checkout -- file  # Discard local changes to a file
\`\`\`

> **Why this matters for hacking:** Pull Requests are how the open-source security ecosystem improves. When you find a bug in a tool like Nmap or Burp, you fork the repo, fix the bug, and submit a PR. The \`git remote add upstream\` pattern keeps your fork synced with the original. In CTF competitions, forks of popular repositories often contain modified versions with hidden vulnerabilities or flags.

**Mini-challenge:** Fork a repository on GitHub (any public repo), clone your fork, add the original as upstream with \`git remote add upstream <original-url>\`, and practice syncing with \`git fetch upstream && git merge upstream/main\`. This is the standard open-source contribution workflow.

Git and GitHub are essential tools for any developer or hacker. Every security tool, exploit, and framework lives on GitHub.`, { hasQuiz: true, quiz: [
        { id: 'git-5-q1', question: 'What is a Pull Request?', options: ['A request to download code', 'A proposal to merge changes from one branch to another', 'A command to pull latest changes', 'A request to delete a repository'], correctIndex: 1, explanation: 'A Pull Request proposes changes from one branch to another, allowing code review before merging.' },
        { id: 'git-5-q2', question: 'What does `git stash` do?', options: ['Deletes changes permanently', 'Temporarily saves uncommitted changes', 'Creates a backup branch', 'Stops tracking a file'], correctIndex: 1, explanation: 'git stash temporarily saves modified tracked files so you can work on something else, then restore them later.' },
        { id: 'git-5-q3', question: 'How do you unstage a file?', options: ['git remove file', 'git reset HEAD file', 'git unstage file', 'git checkout file'], correctIndex: 1, explanation: 'git reset HEAD file removes the file from the staging area without losing changes.' },
      ] }),

    l('git-6', '.gitignore & Project Configuration',
      `Not every file should be tracked. The \`.gitignore\` file tells Git which files to ignore.

**Basic .gitignore:**
\`\`\`bash
# Create a .gitignore file
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/
*.pyc

# Build outputs
dist/
build/
*.exe
*.dll

# Environment
.env
.env.local
*.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Secrets
*.key
*.pem
secrets.txt
EOF
\`\`\`

**Check what Git is tracking:**
\`\`\`bash
# See what would be ignored
git status --ignored

# Check if a specific file is ignored
git check-ignore -v config.env

# List all ignored files
git ls-files --others --ignored --exclude-standard
\`\`\`

**Global .gitignore (for all repos):**
\`\`\`bash
# Create a global gitignore
git config --global core.excludesFile ~/.gitignore_global

# Add common OS files
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
\`\`\`

**Track empty directories (Git doesn't track them):**
\`\`\`bash
# Git doesn't track empty directories
# Place a .gitkeep file to force tracking
touch logs/.gitkeep
            git add logs/.gitkeep
\`\`\`

> **Why this matters for hacking:** A well-configured \`.gitignore\` prevents accidentally committing sensitive files. Security professionals often need to check existing \`.gitignore\` files to see what developers were trying to hide, sometimes the ignored files contain credentials, API keys, or configuration secrets. The \`git check-ignore -v\` command reveals which ignore rule is blocking a file, helping debug tracking issues. In CTFs, finding a \`.gitignore\` that references \`secrets.txt\` or \`*.key\` is a hint that those files exist on the server.

**Mini-challenge:** Create a \`.gitignore\` file with \`echo "secrets.txt" > .gitignore\`, then \`echo "API_KEY=secret" > secrets.txt && git add secrets.txt 2>&1\` — observe that Git refuses to track it. Then verify with \`git check-ignore -v secrets.txt\`. This is the exact workflow for protecting sensitive files.`),

    l('git-7', 'Rebasing & History Management',
      `Rebasing rewrites history for a cleaner commit log. Use it to maintain a linear project history.

**Basic rebase workflow:**
\`\`\`bash
# You're on a feature branch, want latest main
git checkout feature
git rebase main
# This replays your feature commits ON TOP of main
\`\`\`

**Interactive rebase — squash, reorder, edit commits:**
\`\`\`bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3

# You'll see a list like:
# pick abc1234 Add scanner
# pick def5678 Fix bug in scanner
# pick 789abcd Add documentation

# Change "pick" to:
# squash (s) , combine with previous commit
# reword (r) , change commit message
# edit (e)   , modify this commit
# drop (d)   , delete this commit
# fixup (f)  , squash but discard message
\`\`\`

**Squash commits before pushing:**
\`\`\`bash
# Before pushing, squash WIP commits into one clean commit
git rebase -i HEAD~5
# Change all except the first from "pick" to "squash"
# Write a single good commit message
\`\`\`

**Cherry-pick — pick specific commits:**
\`\`\`bash
# Take a specific commit from another branch
git cherry-pick abc1234

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678
\`\`\`

**Revert vs Reset:**
\`\`\`bash
# Revert creates a NEW commit that undoes changes (safe for shared branches)
git revert HEAD

# Reset moves the branch pointer (careful with shared branches!)
git reset --soft HEAD~1    # Keep changes staged
git reset --mixed HEAD~1   # Keep changes unstaged (default)
git reset --hard HEAD~1    # Discard changes completely!
\`\`\`

> **Why this matters for hacking:** Rebasing is a superpower for keeping a clean commit history, especially when developing security tools. Squashing WIP (\`git rebase -i\`) combines messy development commits into clean, meaningful ones before pushing. Cherry-picking (\`git cherry-pick\`) lets you pull specific fixes from one branch to another without merging everything. Understanding \`git revert\` vs \`git reset\` is critical, \`revert\` is safe for shared branches, \`reset --hard\` destroys history and should only be used on local branches.

**Mini-challenge:** Create 3 test commits, then squash them: \`cd /tmp/test-repo && echo "a" > a.txt && git add a.txt && git commit -m "a"\`, repeat for b and c, then \`git rebase -i HEAD~3\` and change the last two "pick" to "squash". This is the standard workflow for cleaning up commits before opening a pull request.

**When NOT to rebase:**
- Never rebase commits that have been pushed to a shared branch
- Git will warn you if you try
- Use merge instead of rebase on public branches`),

    l('git-8', 'Collaboration Workflows & Open Source',
      `Real-world Git is about collaboration. Understanding workflows makes you an effective team member.

**GitHub Flow (simple, common):**
\`\`\`bash
# 1. Branch from main
git checkout -b feature/awesome-hack

# 2. Make changes, commit
git add .
git commit -m "Add awesome hack feature"

# 3. Push branch
git push -u origin feature/awesome-hack

# 4. Open Pull Request on GitHub
# 5. Review, discuss, fix
# 6. Merge via GitHub UI
# 7. Delete the branch
\`\`\`

**Keep your fork updated:**
\`\`\`bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge into your main
git checkout main
git merge upstream/main

# Or rebase
git rebase upstream/main
\`\`\`

**Resolve merge conflicts (the right way):**
\`\`\`bash
# When merge conflicts happen:
# 1. Open the conflicting file
# 2. Look for markers:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> feature-branch

# 3. Edit to keep the correct version (or combine both)
# 4. Remove the markers
# 5. Save, then:
git add resolved-file.txt
git commit -m "Resolve merge conflict in resolved-file.txt"
\`\`\`

**Git hooks — automate checks:**
\`\`\`bash
# Hooks run automatically on certain actions
# Located in .git/hooks/

# pre-commit hook example (check for secrets)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached | grep -q "password|secret|api_key"; then
    echo "ERROR: Found potential secret in commit!"
    exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
\`\`\`

**Useful Git aliases for efficiency:**
\`\`\`bash
# Configure useful shortcuts
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.last "log -1 HEAD"
git config --global alias.unstage "reset HEAD --"

# Now use them:
git lg    # Beautiful commit graph
git undo  # Undo last commit (keep changes)
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Clone a security tool from GitHub
git clone https://github.com/danielmiessler/SecLists.git
cd SecLists

# 2. View the log
git log --oneline -5

# 3. Create a branch for your custom wordlist
git checkout -b my-custom-list

# 4. Make changes, commit, push
# (This is how you contribute to open source!)
\`\`\`

> **Why this matters for hacking:** The GitHub Flow is the standard collaboration model for security tools. Every tool you'll use, from Metasploit to Burp to Nmap, follows this workflow. Git hooks (\`.git/hooks/pre-commit\`) can automatically check for secrets, run tests, or enforce code style before commits are created. Understanding hooks lets you both implement them as a defense and recognize how other projects enforce quality. The \`git lg\` alias visualizes the entire branch structure, essential for understanding complex repositories.

**Mini-challenge:** Install a real security tool via Git: \`git clone https://github.com/danielmiessler/SecLists.git /tmp/wordlists && cd /tmp/wordlists && git lg | head -20\`. Then check what hooks exist: \`ls -la .git/hooks/\`. This mirrors how professionals maintain their tool arsenal — always pulling the latest versions from GitHub.`),
];

export const COURSE: Course = {
  id: 'git-github-101',
  title: 'Git & GitHub 101',
  categoryId: 'programming',
  description:
    'Version control every hacker needs. Learn Git fundamentals and collaborate on GitHub like a pro.',
  overview:
    'Every serious project uses Git. This course teaches you to track changes, branch, merge, and collaborate on GitHub. You’ll learn the commands that power open-source and professional security tools.',
  estimatedMinutes: 55,
  cpCost: 75,
  learningObjectives: [
      'Initialize a Git repository and track changes with commits',
      'Create, switch, and merge branches',
      'Push and pull from GitHub repositories',
      'Collaborate using pull requests and forks',
  ],
  skillLevel: 'beginner',
  lessons: LESSONS,
};
