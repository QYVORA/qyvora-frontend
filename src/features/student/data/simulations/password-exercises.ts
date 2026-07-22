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
    avatar: string;
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
      avatar: '👦',
    },
    narrative: `🔐 Valkyrie: "Marcus Chen — The Script Kiddie — left this MD5 hash in a config file. He thought MD5 was secure. Let's prove him wrong."

MD5 is ancient — it's fast to compute and even faster to crack. Marcus used 'password' as his admin password. Classic mistake.

🔑 Cracking Strategy:
[Hash File] ──> [Identify Type] ──> [Dictionary Attack] ──> [Plaintext]`,
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
      avatar: '👩‍💻',
    },
    narrative: `🔓 Valkyrie: "Sarah O'Brien — The Hash Hoarder — stored user passwords in SHA-256 without salt. She thought SHA-256 was enough. It's not."

SHA-256 is better than MD5, but without salt, it's still vulnerable to rainbow tables and dictionary attacks. Sarah's users are about to have a bad day.

🔑 Attack Vector:
[SHA-256 Hash] ──> [Dictionary Attack] ──> [Plaintext Password]`,
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
      avatar: '🧑‍🔬',
    },
    narrative: `🛡️ Valkyrie: "Viktor Petrov — The Encryption Expert — used bcrypt, which is good. But his password 's3cur3P@ss' is in every dictionary. His expertise is questionable."

Bcrypt is slow by design — it's meant to resist brute-force attacks. But dictionary attacks still work if the password is common. Viktor's ego was his downfall.

⏱️ Bcrypt Challenge:
[Bcrypt Hash] ──> [Slow Dictionary Attack] ──> [Patience] ──> [Plaintext]`,
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
      avatar: '🪟',
    },
    narrative: `🪟 Valkyrie: "James Wilson — The Windows Whisperer — stored his admin password in NTLM format. He used 'password123' across all his accounts. One password to rule them all."

NTLM is fast to compute and fast to crack. James thought complexity rules made his password secure. They don't.

🔑 Windows Attack:
[NTLM Hash] ──> [Fast Dictionary Attack] ──> [Credential Reuse] ──> [Domain Access]`,
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
      avatar: '🕵️',
    },
    narrative: `🕵️ Valkyrie: "Dr. Amara Osei — The Shadow Broker — stored her passwords in /etc/shadow with weak salts. She's a security researcher who should know better."

Linux shadow files contain password hashes, but without proper salting and strong passwords, they're vulnerable. Dr. Osei's hypocrisy is our opportunity.

🐧 Linux Attack:
[Shadow File] ──> [Unshadow] ──> [John the Ripper] ──> [Plaintext Credentials]`,
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
      avatar: '👥',
    },
    narrative: `👥 Valkyrie: "The Hash Syndicate — a group of developers — used different hash types across their applications. Their inconsistency is our opportunity."

Multiple hash types mean multiple attack vectors. The Collective thought diversity would protect them. Instead, it gave us more entry points.

🎯 Multi-Vector Attack:
[Hash List] ──> [Type Identification] ──> [Parallel Cracking] ──> [Full Credential Dump]`,
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
