/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG
 * =========================================
 * Single source of truth for the bootcamp walkthrough structure.
 * MUST mirror the backend bootcamp.config.js exactly.
 *
 * Instruction format supports (GitHub-Flavored Markdown):
 *   - Fenced code blocks:  ```bash\ncommand\n```
 *   - Inline code:         `command`
 *   - Bold:                **text**
 *   - Italic:              *text*
 *   - Bold+Italic:         ***text***
 *   - Unordered lists:     - item
 *   - Ordered lists:       1. item
 *   - Headings:            # text
 *   - Blockquotes:         > text
 *   - Horizontal rule:     ---
 *   - Plain prose
 */

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
}

export interface BootcampRoom {
  id: string;       // e.g. "room1"
  title: string;    // MUST match backend room title exactly (case-insensitive)
  overview: string;
  estimatedMinutes: number; // Estimated time to complete this room
  steps: BootcampStep[];
}

export interface BootcampPhase {
  id: string;       // e.g. "phase1"
  title: string;    // MUST match backend module title exactly (case-insensitive)
  codename: string;
  color?: string;   // hex color for this phase
  rooms: BootcampRoom[];
}

export interface BootcampConfig {
  id: string;
  title: string;
  phases: BootcampPhase[];
}

// ── Phase Colors ──────────────────────────────────────────────────────────────
export const PHASE_COLORS: Record<string, string> = {
  phase1: '#06B66F', // Green (Mindset)
  phase2: '#60A5FA', // Blue (Linux)
  phase3: '#A78BFA', // Purple (Networking)
  phase4: '#F59E0B', // Amber (Web)
  phase5: '#EF4444', // Red (Social)
};

// ── Image path builder ────────────────────────────────────────────────────────
export { getWalkthroughImage as buildStepImagePath } from '../utils/walkthroughImages';

// ── Config ────────────────────────────────────────────────────────────────────
export const BOOTCAMP_CONFIG: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [

    // ── PHASE 1: HACKER MINDSET (moduleId: 1, 4 rooms) ──────────────────────
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      color: PHASE_COLORS.phase1,
      rooms: [
        {
          id: 'room1',
          title: 'Introduction to Offensive Security',
          overview:
            'Offensive security is the practice of thinking and acting like an attacker: with permission, to find weaknesses before real adversaries do. This room explains what the field is, why it exists, and how QYVORA fits into it.',
          estimatedMinutes: 20,
          steps: [],
        },
        {
          id: 'room2',
          title: 'The Hacker Mindset',
          overview:
            'The most important tool you will ever develop is not a piece of software. It is how you think. This room breaks down the cognitive traits that separate effective operators from people who just run tools.',
          estimatedMinutes: 18,
          steps: [],
        },
        {
          id: 'room3',
          title: 'Ethics & Legal Boundaries',
          overview:
            'Operating without authorisation is a criminal offence in every jurisdiction. This room covers the legal framework, the concept of scope, and responsible disclosure: the non-negotiable foundations of professional offensive security.',
          estimatedMinutes: 22,
          steps: [],
        }],
    },

    // ── PHASE 2: LINUX FOUNDATIONS (moduleId: 2, 5 rooms) ───────────────────
    {
      id: 'phase2',
      title: 'Linux Foundations',
      codename: 'PHASE 2',
      color: PHASE_COLORS.phase2,
      rooms: [
        {
          id: 'room1',
          title: 'Linux Basics & Navigation',
          overview:
            "To become an Qyvora Hacker, you must first master the environment where we live: the Linux terminal. This isn't just about typing commands; it's about learning the language of the machine. In this room, you will transition from a curious observer to a skilled operator, building the 'muscle memory' required for high-stakes engagements.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            "Identity is the cornerstone of security. In this room, you'll learn how Linux identifies who is a friend and who is a potential intruder. By mastering user accounts, shadow files, and privilege escalation pathways, you will learn to navigate the Qyvora network like a ghost in the machine.",
          estimatedMinutes: 30,
          steps: [],
        },
        {
          id: 'room3',
          title: 'Processes & Networking',
          overview:
            "A system is a living organism, constantly exchanging data and running background tasks. To train like a hacker is to understand the heartbeat of the machine. In this room, you will learn to monitor every process and every open door in the target environment, identifying targets and evading detection.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            "A hacker who cannot script is like a soldier who cannot aim. Automation is what separates the average user from the Qyvora elite. In this room, you will learn to build your own custom tools, automating the boring tasks so you can focus on the critical breakthroughs. Train like a hacker, automate like a pro.",
          estimatedMinutes: 40,
          steps: [],
        }],
    },

    // ── PHASE 3: NETWORKING (moduleId: 3, 5 rooms) ──────────────────────────
    {
      id: 'phase3',
      title: 'Networking',
      codename: 'PHASE 3',
      color: PHASE_COLORS.phase3,
      rooms: [
        {
          id: 'room1',
          title: 'TCP/IP & OSI Model',
          overview:
            "Every attack and defense in the Qyvora arsenal starts with a fundamental truth: data must move. To become an elite operative, you must look past the screen and see the raw streams of bits traveling through the OSI layers. This room builds the theoretical framework you need to map digital terrain and identify the protocols that underpin everything you will compromise.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room2',
          title: 'DNS, HTTP & Common Protocols',
          overview:
            "The web isn't just a collection of pages; it's a massive, interconnected network of protocols that were never built for security. In this room, you will learn to exploit the 'phonebook' of the internet (DNS) and the 'backbone' of the web (HTTP), uncovering the hidden paths and misconfigurations that lead to total system compromise.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room3',
          title: 'Network Scanning & Enumeration',
          overview:
            "Enumeration is the most critical phase of any engagement. If you don't find it, you can't hack it. In this room, you will master Nmap from first principles, learning to bypass filters and map complex networks like a professional Qyvora operative.",
          estimatedMinutes: 40,
          steps: [],
        },
        {
          id: 'room4',
          title: 'Packet Analysis',
          overview:
            "A hacker who cannot read traffic is blind. Packet analysis is the art of seeing through the noise and identifying the exact data that flows through the Qyvora network. In this room, you will master Wireshark and Tshark, learning to extract credentials, analyze protocols, and reconstruct entire conversations from raw network captures.",
          estimatedMinutes: 35,
          steps: [],
        }],
    },

    // ── PHASE 4: WEB & BACKEND SYSTEMS (moduleId: 4, 6 rooms) ───────────────
    {
      id: 'phase4',
      title: 'Web & Backend Systems',
      codename: 'PHASE 4',
      color: PHASE_COLORS.phase4,
      rooms: [
        {
          id: 'room1',
          title: 'How the Web Works',
          overview:
            "Before you can dismantle a web application, you must understand the invisible architecture that supports it. To train like a hacker is to see the web not as a collection of pages, but as a series of stateless HTTP requests and responses. In this room, you will learn to intercept, read, and manipulate the raw data that flows between the browser and the Qyvora backend.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room2',
          title: 'OWASP Top 10 Overview',
          overview:
            "The OWASP Top 10 is the definitive list of the most critical web security risks. As an Qyvora operative, you must know these categories by heart. This room takes you beyond the definitions, showing you how to detect and demonstrate the impact of each vulnerability using professional tools and techniques.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room3',
          title: 'SQL Injection',
          overview:
            "SQL Injection (SQLi) is the 'Skeleton Key' of web exploitation. It allows an Qyvora operative to step past the front door and talk directly to the database. In this room, you will learn to dismantle queries from the inside out, bypassing authentication and extracting the crown jewels of the Qyvora target: the user credentials.",
          estimatedMinutes: 45,
          steps: [],
        },
        {
          id: 'room4',
          title: 'XSS & CSRF',
          overview:
            "The browser is the most dangerous environment in the digital world. In this room, you will master client-side exploitation, learning how to execute your own code in the context of other users' browsers (XSS) and trick them into performing actions they never intended (CSRF). To train like a hacker is to weaponize the very trust that the web is built on.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room5',
          title: 'Authentication Attacks',
          overview:
            "Authentication is the front door of every application, and it is often left unlocked. To become an Qyvora operative, you must learn to pick that lock without leaving a scratch. This room covers brute force, session attacks, token analysis, and the full range of authentication weaknesses that separate a hardened target from a compromised one.",
          estimatedMinutes: 30,
          steps: [],
        }],
    },

    // ── PHASE 5: SOCIAL ENGINEERING (moduleId: 5, 4 rooms) ──────────────────
    {
      id: 'phase5',
      title: 'Social Engineering',
      codename: 'PHASE 5',
      color: PHASE_COLORS.phase5,
      rooms: [
        {
          id: 'room1',
          title: 'Phishing & Pretexting',
          overview:
            "The most sophisticated firewall in the world is useless if a user is tricked into opening the gate. In this room, you will master the art of 'Human Hacking,' learning the psychological triggers and technical spoofing methods used by Qyvora operatives to bypass digital defenses. To train like a hacker is to understand that the human brain is the most vulnerable OS on the network.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room2',
          title: 'OSINT Fundamentals',
          overview:
            "Before you ever touch a keyboard on a target system, you must know it better than its own owners. Open Source Intelligence (OSINT) is the art of gathering the pieces of a puzzle from the public domain. In this room, you will learn to use the internet as your primary reconnaissance tool, harvesting data from search engines, social media, and hidden databases to build a complete profile of the Qyvora target.",
          estimatedMinutes: 35,
          steps: [],
        },
        {
          id: 'room3',
          title: 'Physical Security',
          overview:
            "Physical access is the ultimate bypass. All the digital firewalls in the world are useless if an Qyvora operative can simply walk into the server room and plug in a USB. In this room, you will learn the techniques of physical intrusion, from tailgating and badge cloning to the art of the social engineer's 'walk-through.' To become a hacker is to understand that the lock on the door is just another protocol to be cracked.",
          estimatedMinutes: 30,
          steps: [],
        }],
    }],
};
