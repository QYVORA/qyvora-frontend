import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('git-1', 'What is Version Control?',
      `**Version control** tracks every change you make to your files. Think of it like a "save game" for your code — you can go back to any previous state.

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

If you don't have Git, install it: \`sudo apt install git\` (Linux) or download from git-scm.com.`),

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

\`README.md\` is "untracked" — Git sees it but isn't watching it yet.

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

The workflow: **edit → git add → git commit**. Repeat.`),

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

Branches are the superpower of Git — they let you experiment freely without fear.`),

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
\`\`\``),

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
# squash (s)  — combine with previous commit
# reword (r)  — change commit message
# edit (e)    — modify this commit
# drop (d)    — delete this commit
# fixup (f)   — squash but discard message
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
\`\`\``),
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
