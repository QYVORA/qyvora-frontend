export interface PasswordExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hashType: string;
  hashFile: string;
  hashContent: string;
  crackedPassword: string;
  wordlist: string;
  steps: string[];
  cpReward: number;
  villain?: {
    name: string;
    alias: string;
    description: string;
  };
  narrative?: string;
}

export function getShadowFileContent(): string {
  return `root:$6$XJ7Gk$v8z0GpQb1k3xP9xN2a5kX7YqT4wJ1mO6bV9cD3eF4gH5jK6lP7sA8bN9mC0dL2eR3fG4hI5=:19458:0:99999:7:::
daemon:*:18375:0:99999:7:::
bin:$6$Lr8Dq$k2mX4vJ1nQ7pW9tR3yB5cF6eG8hI0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE1fG2hI3=:19012:0:99999:7:::
sys:$6$Rm4Tv$z1x2c3v4b5n6m7l8k9j0h1g2f3d4s5a6p7o8i9u0y1t2r3e4w5q6a7s8d9f0g1h2j3k4=:19012:0:99999:7:::
sync:*:18375:0:99999:7:::
games:*:18375:0:99999:7:::
man:*:18375:0:99999:7:::
lp:*:18375:0:99999:7:::
mail:*:18375:0:99999:7:::
news:*:18375:0:99999:7:::
uucp:*:18375:0:99999:7:::
proxy:*:18375:0:99999:7:::
www-data:$6$mK3pL$9qW8eR5tY2uI0oP3aS4dF6gH7jK1lZ8xC5vB0nM2qW4eR6tY8uI9oP0aS1dF3gH=:19100:0:99999:7:::
backup:*:18375:0:99999:7:::
list:*:18375:0:99999:7:::
irc:*:18375:0:99999:7:::
gnats:*:18375:0:99999:7:::
nobody:*:18375:0:99999:7:::
sshd:!:19458:0:99999:7:::
admin:$2y$10$Rz3mN4pQ7wE9tY1uI3oP5aS8dF0gH2jK4lZ6xV8bN1qW3eR5tY7uI9oP1aS3dF5gH=:19200:0:99999:7:::
deploy:$1$AbCdEfGh$iKjLmNoPqRsTuVwXyZ0123=:19300:0:99999:7:::
testuser:$5$rounds=5000$SaltsAreGood$8fJqZ3kL5mN7oP9rS1tV3wX5yZ7aB9cD1eF3gH5jK7=:19400:0:99999:7:::
appuser:$6$Ck9Xr$vN3bM5xQ7wE9tY1uI3oP5aS8dF0gH2jK4lZ6xV8bN1qW3eR5tY7uI9oP1aS3dF5gH=:19430:0:99999:7:::
svc_account:!:19458:0:99999:7:::
`;
}

export const PASSWORD_EXERCISES: PasswordExercise[] = [
  {
    id: 'pwd-crack-md5-simple',
    title: 'MD5 Hash Cracking',
    description:
      'Crack a simple MD5 password hash using Hashcat to find the original password.',
    difficulty: 'beginner',
    hashType: 'MD5',
    hashFile: 'mystery_hash.txt',
    hashContent: '5f4dcc3b5aa765d61d8327deb882cf99',
    crackedPassword: 'password',
    wordlist: 'rockyou.txt',
    villain: {
      name: 'Marcus Chen',
      alias: 'The Script Kiddie',
      description: 'A low-level hacker who relies on pre-made tools and weak passwords. His MD5 hashes are trivial to crack.',
    },
    narrative: `> **Valkyrie:** "Marcus Chen — The Script Kiddie — left this MD5 hash in a config file. He thought MD5 was secure because 'everyone uses it.' Let's prove him wrong in seconds."

Marcus Chen is the kind of developer who copy-pastes security advice from 2005. He used MD5 to hash his admin password because "it's the standard." But MD5 was broken decades ago — it's not just weak, it's *cryptographically broken*. A modern GPU can compute 100 billion MD5 hashes per second. Marcus's password — yes, literally the word **password** — will be cracked before he finishes reading this narrative.

## Why MD5 Is Hopeless

MD5 is unsalted, meaning identical passwords produce identical hashes. If two users both have \`password\`, their hashes are the same. That single property enables **rainbow table attacks** — precomputed tables of billions of common password hashes that turn a lookup into instant plaintext. Marcus didn't just choose a weak hash type; he paired the weakest hash type with the weakest possible password.

The deeper lesson is that the *algorithm* is only half the story. Unsalted MD5 makes every account in a leaked database crackable at once, because one password crack immediately reveals every other account that reused it. Modern storage should always use a salt plus a deliberately slow, memory-hard algorithm.

## Cracking Strategy

\`[Hash File]\` --> \`[Identify Type]\` --> \`[Dictionary Attack]\` --> \`[Plaintext]\`

Run the command below to begin. Hashcat's \`-m 0\` flag selects the MD5 module, and pointing it at \`rockyou.txt\` feeds the wordlist that contains Marcus's password.`,
    steps: [
      'echo "5f4dcc3b5aa765d61d8327deb882cf99" > mystery_hash.txt',
      'hashcat -m 0 mystery_hash.txt rockyou.txt',
      'hashcat -m 0 mystery_hash.txt rockyou.txt --show',
    ],
    cpReward: 50,
  },
  {
    id: 'pwd-crack-sha256-common',
    title: 'SHA-256 Hash Cracking',
    description:
      'Use Hashcat to crack a standard SHA-256 hash and recover the admin password.',
    difficulty: 'beginner',
    hashType: 'SHA-256',
    hashFile: 'user_hash.txt',
    hashContent: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    crackedPassword: 'password',
    wordlist: 'rockyou.txt',
    villain: {
      name: "Sarah O'Brien",
      alias: 'The Hash Hoarder',
      description: 'A database admin who stored passwords in SHA-256 without salt. Her hashes are vulnerable to dictionary attacks.',
    },
    narrative: `> **Valkyrie:** "Sarah O'Brien — The Hash Hoarder — stored user passwords in SHA-256 without salt. She thought SHA-256 was enough because 'it's what Bitcoin uses.' It's not."

Sarah's reasoning is common but fatally flawed. SHA-256 is a cryptographic hash function designed for *integrity verification*, not password storage. Without salt, identical passwords produce identical hashes — enabling rainbow table attacks. Sarah's users chose \`password\` as their password (because users always do), and the SHA-256 hash of \`password\` is one of the most well-known hashes in existence. A dictionary attack cracks it in under a second.

## The Real Lesson: Algorithm Alone Is Not Security

The key takeaway is that hash algorithm choice alone doesn't make passwords secure. **Salt** — random data unique to each password — is essential because it prevents precomputed attacks and forces an attacker to crack every password independently. Even SHA-512 without salt is vulnerable to dictionary attacks.

Sarah should have used **bcrypt**, **scrypt**, or **Argon2** — algorithms specifically designed for password storage with built-in salting and key stretching. Key stretching deliberately makes each hash slow to compute, so an attacker who steals the database can only test a handful of guesses per second instead of billions.

## Attack Vector

\`[SHA-256 Hash]\` --> \`[Dictionary Attack]\` --> \`[Plaintext Password]\`

Hashcat's \`-m 1400\` module handles raw SHA-256. Compare the speed difference against the MD5 exercise — it's slower, but with a common password it still falls almost instantly.`,
    steps: [
      'echo "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" > user_hash.txt',
      'hashcat -m 1400 user_hash.txt rockyou.txt',
      'hashcat -m 1400 user_hash.txt rockyou.txt --show',
    ],
    cpReward: 75,
  },
  {
    id: 'pwd-crack-bcrypt',
    title: 'bcrypt Hash Cracking',
    description:
      'Crack a secure bcrypt database hash. Bcrypt is slow to crack, so it needs a targeted dictionary attack.',
    difficulty: 'intermediate',
    hashType: 'bcrypt',
    hashFile: 'bcrypt_hash.txt',
    hashContent: '$2y$10$ZxR3kL5mN7oP9rS1tV3wXyZ0aB2cD4eF6gH8jK0lM2nO4pQ6rS8tU0vW',
    crackedPassword: 's3cur3P@ss',
    wordlist: 'rockyou.txt',
    villain: {
      name: 'Viktor Petrov',
      alias: 'The Encryption Expert',
      description: 'A security consultant who used bcrypt but chose a weak password. His "expert" reputation is about to crumble.',
    },
    narrative: `> **Valkyrie:** "Viktor Petrov — The Encryption Expert — used bcrypt, which is good. But his password 's3cur3P@ss' is in every dictionary. His expertise is about to crumble."

Viktor is a security consultant who actually chose the *right* algorithm — bcrypt with a cost factor of 10. That's commendable. But he made the classic mistake: choosing a "clever" password that's really a common dictionary word with leet-speak substitutions. \`s3cur3P@ss\` appears in virtually every password dictionary because it's exactly the kind of password security-conscious people choose. It's on every "top 10000 passwords" list.

## Slow Does Not Mean Safe

Bcrypt is designed to be slow — each hash takes about 100ms to compute, making brute-force attacks roughly 10,000x slower than MD5. That's the point of key stretching. But slow doesn't mean impossible: with a targeted dictionary attack and a modern GPU, Viktor's bcrypt hash still falls in minutes.

The lesson is that **strong algorithms cannot compensate for weak passwords**. A random 16-character passphrase would have made Viktor's bcrypt hash effectively uncrackable — the computational cost would be measured in centuries rather than minutes. Defense in depth means picking both a strong algorithm *and* high-entropy secrets.

## Bcrypt Challenge

\`[Bcrypt Hash]\` --> \`[Slow Dictionary Attack]\` --> \`[Patience]\` --> \`[Plaintext]\`

Use Hashcat's \`-m 3200\` module for bcrypt. The \`--force\` flag suppresses hardware warnings so the attack can run.`,
    steps: [
      'echo "$2y$10$ZxR3kL5mN7oP9rS1tV3wXyZ0aB2cD4eF6gH8jK0lM2nO4pQ6rS8tU0vW" > bcrypt_hash.txt',
      'hashcat -m 3200 bcrypt_hash.txt rockyou.txt --force',
      'hashcat -m 3200 bcrypt_hash.txt rockyou.txt --show',
    ],
    cpReward: 150,
  },
  {
    id: 'pwd-crack-ntlm-windows',
    title: 'NTLM Hash Cracking',
    description:
      'Crack an NTLM password hash dumped from a Windows system using a fast dictionary attack with Hashcat.',
    difficulty: 'intermediate',
    hashType: 'NTLM',
    hashFile: 'ntlm_hash.txt',
    hashContent: '8846f7eaee8fb117ad06bdd830b7586c',
    crackedPassword: 'password123',
    wordlist: 'rockyou.txt',
    villain: {
      name: 'James Wilson',
      alias: 'The Windows Whisperer',
      description: 'A Windows sysadmin who thought NTLM was secure. He used the same password across all his accounts.',
    },
    narrative: `> **Valkyrie:** "James Wilson — The Windows Whisperer — stored his admin password in NTLM format. He used 'password123' across all his accounts. One password to rule them all."

James is a Windows sysadmin who should know better but fell into the convenience trap. **NTLM** is Microsoft's legacy authentication protocol, and it's *fast* — dangerously fast. An NTLM hash can be computed in nanoseconds, making brute-force attacks trivially quick on modern hardware. James added a number (\`123\`) to \`password\` and thought that made it secure. It doesn't. \`password123\` is the second most common password in the world.

## The Real Danger: Credential Reuse

James didn't just use this password for his Windows login — he used it for email, VPN, GitHub, and the company admin panel. Cracking one NTLM hash gives an attacker access to **everything James touches**. This is why credential reuse is the number one attack vector in corporate breaches: a single weak password, reused across services, can bring down an entire organization.

During a real engagement, the moment we recover a password we would immediately test it against other hosts with tools like \`crackmapexec\` — spraying the same credential across the whole network to see where else it works.

## Windows Attack

\`[NTLM Hash]\` --> \`[Fast Dictionary Attack]\` --> \`[Credential Reuse]\` --> \`[Domain Access]\`

Use Hashcat's \`-m 1000\` module for NTLM. Note how much faster this runs than the bcrypt exercise — that speed difference is exactly why Windows hashes are so prized by attackers.`,
    steps: [
      'echo "8846f7eaee8fb117ad06bdd830b7586c" > ntlm_hash.txt',
      'hashcat -m 1000 ntlm_hash.txt rockyou.txt',
      'hashcat -m 1000 ntlm_hash.txt rockyou.txt --show',
    ],
    cpReward: 125,
  },
  {
    id: 'pwd-crack-shadow-extract',
    title: '/etc/shadow Extraction and Cracking',
    description:
      'Combine Linux passwd and shadow files using the unshadow tool, then crack the hashes using John the Ripper.',
    difficulty: 'advanced',
    hashType: 'Multiple (SHA-512 / bcrypt / MD5)',
    hashFile: 'shadow.txt',
    hashContent: getShadowFileContent(),
    crackedPassword: 'sunshine (appuser), summer (admin)',
    wordlist: 'rockyou.txt',
    villain: {
      name: 'Dr. Amara Osei',
      alias: 'The Shadow Broker',
      description: 'A Linux security researcher who stored weak passwords in /etc/shadow. Her SHA-512 hashes with weak salts are vulnerable.',
    },
    narrative: `> **Valkyrie:** "Dr. Amara Osei — The Shadow Broker — stored her passwords in /etc/shadow with weak salts. She's a security researcher who should know better. Her hypocrisy is our opportunity."

Dr. Osei writes papers about password security. She lectures at conferences about the importance of strong hashing. And yet, when she set up her own server, she used weak passwords with predictable salts. The \`/etc/shadow\` file contains password hashes for every user on a Linux system — it's one of the most sensitive files on any Unix machine.

## Reading the File Like an Attacker

Dr. Osei's shadow file contains multiple hash types: **SHA-512** (\`$6$\`), **bcrypt** (\`$2y$\`), **MD5** (\`$1$\`), and **SHA-256** (\`$5$\`). This variety tells a story — different users chose different hashing methods, and some chose weaker ones. The file also reveals which accounts are locked (marked with \`!\` or \`*\`) and which actually have passwords.

This matters because attackers prioritize targets: the **deploy** account uses MD5 (\`$1$\`) — the weakest hash in the file. The **admin** account uses bcrypt (\`$2y$\`) — better, but paired with the weak password \`summer\`. The **appuser** uses SHA-512 (\`$6$\`) — the strongest hash, but \`sunshine\` is a dictionary word. Real-world cracking is about triage: crack the weak hashes first, then pivot.

## Linux Attack

\`[Shadow File]\` --> \`[Unshadow]\` --> \`[John the Ripper]\` --> \`[Plaintext Credentials]\`

The \`unshadow\` tool merges \`/etc/passwd\` and \`/etc/shadow\` so John can read both usernames and hashes together. This is the standard Linux password-cracking workflow.`,
    steps: [
      'cat /etc/shadow > shadow.txt',
      'unshadow /etc/passwd shadow.txt > unshadowed.txt',
      'john --wordlist=rockyou.txt unshadowed.txt',
      'john --show unshadowed.txt',
      'hashcat -m 1800 shadow.txt rockyou.txt',
      'hashcat -m 3200 shadow.txt rockyou.txt',
    ],
    cpReward: 250,
  },
  {
    id: 'pwd-crack-multi-hash',
    title: 'Multi-Hash Type Cracking',
    description:
      'Identify and crack a list of multiple different hash types (MD5, SHA-1, SHA-256, SHA-512) left behind in a developer file.',
    difficulty: 'advanced',
    hashType: 'Mixed (MD5, SHA-1, SHA-256, SHA-512)',
    hashFile: 'multi_hashes.txt',
    hashContent: [
      '5f4dcc3b5aa765d61d8327deb882cf99',
      'b109f3bbce2408c5f181e6c6d23b6e4e',
      'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      '$6$rounds=5000$SaltsAreGood$8fJqZ3kL5mN7oP9rS1tV3wX5yZ7aB9cD1eF3gH5jK7',
    ].join('\n'),
    crackedPassword: 'password, letmein, qwerty, trustn01',
    wordlist: 'rockyou.txt',
    villain: {
      name: 'The Collective',
      alias: 'The Hash Syndicate',
      description: 'A group of developers who used different hash types across their applications. Their inconsistent security practices created multiple attack vectors.',
    },
    narrative: `> **Valkyrie:** "The Hash Syndicate — a group of developers — used different hash types across their applications. Their inconsistency is our opportunity."

The Collective represents a common real-world scenario: different developers joined the company at different times, each implementing their own "secure" password hashing. One uses MD5 (the 2005 approach), another uses SHA-1 (the 2010 approach), a third uses SHA-256 (the 2015 approach), and the last uses salted SHA-512 (the modern approach). The problem is that inconsistency creates **multiple attack vectors**. An attacker doesn't need to find the "best" hash — they just need to find the weakest one.

## Attack Speed Is Everything

Each hash type has a different attack speed on modern GPUs:

- **MD5**: ~100 billion hashes per second — falls in seconds
- **SHA-1**: ~40 billion per second — falls in seconds
- **SHA-256**: ~20 billion per second — falls in minutes
- **SHA-512 (salted)**: ~1 million per second — takes hours

This exercise demonstrates why organizations need a **unified, modern hashing standard**. "Diversity" in security implementations is a liability, not a strength — every legacy hash type is a weak link in the chain.

## Multi-Vector Attack

\`[Hash List]\` --> \`[Type Identification]\` --> \`[Parallel Cracking]\` --> \`[Full Credential Dump]\`

Identify each hash's prefix (\`$1$\`, \`$5$\`, \`$6$\`, or raw 32/40/64-char hex) and run the matching Hashcat module against the whole file in parallel.`,
    steps: [
      'cat > multi_hashes.txt << EOF',
      '5f4dcc3b5aa765d61d8327deb882cf99',
      'b109f3bbce2408c5f181e6c6d23b6e4e',
      'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      '$6$rounds=5000$SaltsAreGood$8fJqZ3kL5mN7oP9rS1tV3wX5yZ7aB9cD1eF3gH5jK7',
      'EOF',
      'hashcat -m 0 multi_hashes.txt rockyou.txt',
      'hashcat -m 100 multi_hashes.txt rockyou.txt',
      'hashcat -m 1400 multi_hashes.txt rockyou.txt',
      'hashcat -m 1800 multi_hashes.txt rockyou.txt',
      'hashcat --show multi_hashes.txt',
    ],
    cpReward: 300,
  },
];
