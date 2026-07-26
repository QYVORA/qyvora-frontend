import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('py-1', 'Your First Python Script',
      `Python is the most popular language for security tools. It's readable, has a massive ecosystem of libraries, and is the language behind tools like Nmap scripts, Metasploit modules, Burp extensions, and countless exploit frameworks. If you're going to work in cybersecurity, Python is the language you need to know first.

Print to the screen:

\`\`\`python
print("Hello, Hacker!")
\`\`\`

Save this as \`hello.py\` and run: \`python3 hello.py\`

**Variables** store data — and in security, you'll use them to hold targets, credentials, and scan results:

\`\`\`python
name = "Alice"
target_ip = "192.168.1.1"
port = 8080
is_vulnerable = True

print(f"Scanning {target_ip} on port {port}")
\`\`\`

Variables are like labeled boxes. \`target_ip\` holds a string (text in quotes), \`port\` holds an integer (a whole number), and \`is_vulnerable\` holds a boolean (True or False). Python figures out the type automatically — you don't need to declare it.

The \`f\` before the string makes it an **f-string** — short for "formatted string literal." Inside the curly braces \`{}\`, you can put any variable or expression, and Python will convert it to text and insert it into the string. It's the easiest way to build dynamic output:

\`\`\`python
port = 443
print(f"Port {port} is {'open' if port < 1024 else 'closed'}")
# "Port 443 is closed"
\`\`\`

F-strings work with any data type — numbers, booleans, even function calls inside the braces.

**Comments** explain your code:

\`\`\`python
# This is a comment
# Everything after # is ignored by Python

"""
Multi-line comments
use triple quotes
"""
\`\`\`

Comments won't affect execution but help others (and your future self) understand your code. In security scripts, comments are especially important because you'll often revisit tools months later and need to remember what they do.

In real-world hacking, Python scripts automate repetitive tasks. A port scanner is a Python script. A brute-forcer is a Python script. A tool that parses Nmap XML output and finds vulnerabilities is a Python script. Learning to write these yourself means you can build custom tools tailored to any engagement.`,
      { hasCodePlayground: true, codePlaygroundInitial: 'print("Hello, Hacker!")\n\nname = "target"\nprint(f"Scanning {name}")', codePlaygroundLanguage: 'python', codePlaygroundExpectedOutput: 'Hello, Hacker!\nScanning target' }),

    l('py-2', 'Strings & Data Types',
      `Python has several built-in data types. Understanding them is crucial because security tools deal with many different types of data — IPs as strings, ports as integers, scan results as booleans, and tool output that needs to be parsed and converted.

\`\`\`python
# Strings — text (anything in quotes)
name = "target.com"
domain = 'example.com'
combined = name + "/" + domain   # "target.com/example.com"

# Numbers
port = 80              # integer (whole number)
timeout = 1.5          # float (decimal number)

# Boolean
is_alive = True
has_scan = False

# Type conversion
port_str = str(80)     # "80" — converts number to string
port_int = int("80")   # 80 — converts string to number
\`\`\`

Why do data types matter? Because many security tools return text (strings) even when the data is really numbers. Nmap output gives you "80" as a string, not 80 as an integer. If you try to do math on a string, Python will throw an error. You need to convert it first with \`int()\` or \`float()\`.

Type conversion is something you'll use constantly:
- \`str()\` — convert to string (useful when building output or joining text with numbers)
- \`int()\` — convert to integer (useful when parsing port numbers from tool output)
- \`float()\` — convert to decimal (useful for timeout values or measurements)
- \`bool()\` — convert to boolean (useful for checking if a value is truthy)

\`\`\`python
# Common scenario: parsing tool output
raw_port = "443"            # This is a string from tool output
port_number = int(raw_port) # Now it's an integer
print(f"Scanning port {port_number + 1}")  # 444 — math works!
\`\`\`

**String operations** are essential for parsing tool output and building custom scripts:

\`\`\`python
url = "https://target.com/login"
print(url.upper())        # "HTTPS://TARGET.COM/LOGIN"
print(url.split("/"))     # ['https:', '', 'target.com', 'login']
print(url.startswith("https"))  # True
print(url.replace("login", "admin"))  # "https://target.com/admin"
\`\`\`

The \`split()\` method is especially powerful for parsing — it breaks a string into a list wherever it finds the delimiter. The \`replace()\` method lets you swap parts of strings, which is useful for building URLs or modifying tool output.

**Slicing** lets you extract specific parts of a string by position:

\`\`\`python
url = "https://target.com/login"
print(url[0:5])           # "https" — characters 0 through 4
print(url[-5:])           # "login" — last 5 characters
print(url[8:])            # "target.com/login" — everything from index 8
\`\`\`

Think of slicing like cutting a piece of tape: \`string[start:end]\` gives you everything from the start index up to (but not including) the end index. Negative indices count from the end of the string. This is incredibly useful when parsing IP addresses, extracting file extensions, or pulling specific fields from log output.

**f-strings** make formatting easy — they're the modern way to build strings with embedded variables:

\`\`\`python
host = "192.168.1.1"
port = 443
print(f"Connecting to {host}:{port}")
# "Connecting to 192.168.1.1:443"
\`\`\``),

    l('py-3', 'Lists & Dictionaries',
      `**Lists** hold ordered collections of items:

\`\`\`python
ports = [22, 80, 443, 8080]
print(ports[0])      # 22 (first item, index starts at 0)
print(ports[-1])     # 8080 (last item)

ports.append(3306)   # add to end
ports.remove(80)     # remove a value
print(len(ports))    # number of items

# Loop through a list
for port in ports:
    print(f"Checking port {port}")
\`\`\`

**Dictionaries** store key-value pairs (like a phonebook):

\`\`\`python
target = {
    "ip": "10.0.0.1",
    "hostname": "server01",
    "ports": [22, 80, 443],
    "os": "Linux"
}

print(target["ip"])        # "10.0.0.1"
print(target.get("os"))    # "Linux" (safe access)

# Loop through dictionary
for key, value in target.items():
    print(f"{key}: {value}")
\`\`\`

**Lists of dictionaries** are common in security tools:

\`\`\`python
scan_results = [
    {"port": 22,  "state": "open",  "service": "SSH"},
    {"port": 80,  "state": "open",  "service": "HTTP"},
    {"port": 443, "state": "filtered", "service": "HTTPS"},
]

for result in scan_results:
    if result["state"] == "open":
        print(f"Port {result['port']} is OPEN — {result['service']}")
\`\`\``),

    l('py-4', 'Conditionals & Loops',
      `**Conditionals** let your code make decisions:

\`\`\`python
port = 80

if port == 22:
    print("SSH service")
elif port == 80:
    print("HTTP service")
elif port == 443:
    print("HTTPS service")
else:
    print(f"Unknown port: {port}")
\`\`\`

Comparison operators: \`==\` (equal), \`!=\` (not equal), \`>\`, \`<\`, \`>=\`, \`<=\`

\`\`\`python
if port > 0 and port < 1024:
    print("Privileged port")

if port == 80 or port == 443:
    print("Web port")
\`\`\`

**Loops** repeat actions:

\`\`\`python
# For loop — iterate over a range
for i in range(1, 5):
    print(f"Attempt {i}")

# While loop — repeat until condition is false
count = 0
while count < 3:
    print(f"Scanning... attempt {count + 1}")
    count += 1

# Break — exit loop early
for port in range(1, 1024):
    if port == 80:
        print("Found HTTP port!")
        break

# Continue — skip to next iteration
for port in range(1, 10):
    if port == 5:
        continue   # skip port 5
    print(f"Checking port {port}")
\`\`\``),

    l('py-5', 'Functions & Modules',
      `**Functions** group code into reusable blocks:

\`\`\`python
def scan_port(host, port):
    """Check if a port is open on a host."""
    print(f"Scanning {host}:{port}")
    # Function body goes here
    return True

# Call the function
result = scan_port("192.168.1.1", 80)
print(f"Port 80 is open: {result}")
\`\`\`

Functions keep your code organized. The \`def\` keyword defines a function, and \`return\` sends back a value.

**Modules** are Python files you can import:

\`\`\`python
import os
import sys
import json

print(os.name)              # Operating system name
print(sys.version)          # Python version

# Parse JSON
data = '{"host": "test.com", "port": 80}'
parsed = json.loads(data)
print(parsed["host"])
\`\`\`

The **requests** library is essential for HTTP:

\`\`\`bash
# Install it first
pip install requests
\`\`\`

\`\`\`python
import requests

response = requests.get("https://httpbin.org/json")
print(response.status_code)      # 200
print(response.json())           # parsed JSON data
print(response.headers)          # response headers

# POST request
data = {"username": "admin", "password": "test"}
r = requests.post("https://httpbin.org/post", data=data)
print(r.text)
\`\`\``),

    l('py-6', 'Building a Port Scanner',
      `Let's build a real port scanner using Python's \`socket\` library.

\`\`\`python
import socket

def scan_port(host, port):
    """Try to connect to a port. Return True if open."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    result = s.connect_ex((host, port))
    s.close()
    return result == 0

# Test a single port
host = "scanme.nmap.org"
if scan_port(host, 80):
    print(f"{host}:80 is OPEN")
else:
    print(f"{host}:80 is CLOSED")
\`\`\`

\`connect_ex\` returns 0 if the connection succeeded (port is open), or an error code if it failed.

Now scan multiple ports:

\`\`\`python
common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445,
                993, 995, 1433, 1521, 3306, 3389, 5432, 8080, 8443]

host = "scanme.nmap.org"
print(f"Scanning {host}...")

for port in common_ports:
    if scan_port(host, port):
        print(f"  [+] {host}:{port} is OPEN")
\`\`\`

This is exactly how real port scanners work — they attempt TCP connections on each port and report which ones succeed. Try running this against \`scanme.nmap.org\` (a legal test target).

To speed things up, you can use threading:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

host = "scanme.nmap.org"
ports = range(1, 1024)

with ThreadPoolExecutor(max_workers=50) as executor:
    results = executor.map(lambda p: (p, scan_port(host, p)), ports)
    for port, is_open in results:
        if is_open:
            print(f"  [+] {port} is OPEN")
\`\`\`

Threading lets you scan many ports simultaneously, making the process much faster.`,

      { hasQuiz: true, quiz: [
        { id: 'py-6-q1', question: 'What does socket.connect_ex() return if a port is open?', options: ['True', '1', '0', 'None'], correctIndex: 2, explanation: 'connect_ex() returns 0 on success (port open) and an error code on failure.' },
        { id: 'py-6-q2', question: 'What library is used for threading in Python?', options: ['threading', 'multiprocessing', 'concurrent.futures', 'asyncio'], correctIndex: 2, explanation: 'concurrent.futures.ThreadPoolExecutor provides a high-level interface for threading.' },
        { id: 'py-6-q3', question: 'Why use threading in a port scanner?', options: ['To bypass firewalls', 'To scan multiple ports simultaneously', 'To avoid detection', 'To reduce network traffic'], correctIndex: 1, explanation: 'Threading allows scanning many ports at once, dramatically speeding up the process.' },
      ] }),

    l('py-7', 'File I/O & Error Handling',
      `Reading and writing files is essential for saving scan results, reading wordlists, and logging output. Error handling prevents your scripts from crashing.

**Reading files — start simple:**
\`\`\`python
# Read entire file
with open("targets.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line (memory efficient for large files)
with open("rockyou.txt", "r", encoding="latin-1") as f:
    for line in f:
        print(line.strip())  # .strip() removes \\n
        break  # Just show first line
\`\`\`

**Writing files:**
\`\`\`python
# Write to a file (overwrites!)
with open("results.txt", "w") as f:
    f.write("Scan started at: ...\\n")
    f.write("Port 80: open\\n")

# Append to a file
with open("results.txt", "a") as f:
    f.write("Port 443: open\\n")

# Write multiple lines from a list
ports = [22, 80, 443, 8080]
with open("open_ports.txt", "w") as f:
    for port in ports:
        f.write(f"{port}\\n")
\`\`\`

**Error handling with try/except:**
\`\`\`python
# Basic error handling
try:
    with open("config.txt", "r") as f:
        data = f.read()
except FileNotFoundError:
    print("[-] Config file not found!")
except PermissionError:
    print("[-] Permission denied!")
except Exception as e:
    print(f"[-] Unexpected error: {e}")
\`\`\`

**Handle network errors gracefully:**
\`\`\`python
import socket
import sys

def scan_port(host, port):
    """Safe port scan with error handling."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        result = s.connect_ex((host, port))
        s.close()
        return result == 0
    except socket.gaierror:
        print(f"[-] Hostname resolution failed: {host}")
        return False
    except socket.timeout:
        print(f"[-] Connection timed out: {host}:{port}")
        return False
    except Exception as e:
        print(f"[-] Error scanning {host}:{port}: {e}")
        return False
\`\`\`

**Read a wordlist for brute-forcing:**
\`\`\`python
def load_wordlist(path):
    """Load a wordlist file, return list of words."""
    try:
        with open(path, "r", encoding="latin-1", errors="ignore") as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"[-] Wordlist not found: {path}")
        return []

# Usage
passwords = load_wordlist("/usr/share/wordlists/rockyou.txt")
print(f"[+] Loaded {len(passwords)} passwords")
\`\`\`

**Practical build-up — a log parser:**
\`\`\`python
# Start simple, then add features
def parse_auth_log(log_path):
    """Parse SSH auth log for failed/successful logins."""
    failed = 0
    success = 0
    
    try:
        with open(log_path, "r") as f:
            for line in f:
                if "Failed password" in line:
                    failed += 1
                elif "Accepted password" in line:
                    success += 1
    except FileNotFoundError:
        print(f"[-] Log file not found: {log_path}")
        return
    
    print(f"[+] Failed logins: {failed}")
    print(f"[+] Successful logins: {success}")
    print(f"[+] Total attempts: {failed + success}")

parse_auth_log("/var/log/auth.log")
\`\`\`

Always handle file and network errors — your scripts will run unattended and WILL encounter edge cases.`),

    l('py-8', 'Web Scraping & HTTP Requests',
      `The \`requests\` library makes HTTP simple. Combined with parsing tools, you can extract data from websites and APIs.

**Basic HTTP requests (build up):**
\`\`\`python
import requests

# Simple GET
r = requests.get("https://httpbin.org/get")
print(r.status_code)     # 200
print(r.text[:200])      # First 200 chars

# With parameters
params = {"q": "sql injection", "page": 1}
r = requests.get("https://httpbin.org/get", params=params)
print(r.url)  # Shows the full URL with parameters
\`\`\`

**Work with response data:**
\`\`\`python
import requests

r = requests.get("https://httpbin.org/json")

# Check response type
print(r.headers["Content-Type"])   # application/json

# Parse JSON
data = r.json()
print(data.keys())                 # Top-level keys

# Save response to file
with open("response.json", "w") as f:
    f.write(r.text)
\`\`\`

**POST requests with data:**
\`\`\`python
import requests

# Form data (like a browser form submission)
data = {"username": "admin", "password": "test123"}
r = requests.post("https://httpbin.org/post", data=data)
print(r.text)

# JSON data (like an API call)
json_data = {"username": "admin", "password": "test123"}
r = requests.post("https://httpbin.org/post", json=json_data)

# With custom headers
headers = {"User-Agent": "Mozilla/5.0", "X-Custom": "test"}
r = requests.get("https://httpbin.org/headers", headers=headers)
\`\`\`

**Handle sessions and cookies:**
\`\`\`python
import requests

# Session object persists cookies across requests
s = requests.Session()

# Log in (cookies are saved in the session)
login_data = {"username": "admin", "password": "secret"}
s.post("https://httpbin.org/post", data=login_data)

# Subsequent requests use the saved cookies
r = s.get("https://httpbin.org/cookies")
print(r.text)
\`\`\`

**Web scraping with BeautifulSoup:**
\`\`\`bash
# Install first
pip install beautifulsoup4 lxml
\`\`\`

\`\`\`python
import requests
from bs4 import BeautifulSoup

# Fetch a page
r = requests.get("https://httpbin.org/html")
soup = BeautifulSoup(r.text, "html.parser")

# Find elements
title = soup.title.text
print(f"Page title: {title}")

# Find all links
for link in soup.find_all("a"):
    href = link.get("href")
    text = link.text.strip()
    print(f"{text} -> {href}")

# Find by class or id
# soup.find_all(class_="content")
# soup.find(id="main-content")

# Extract all text
text = soup.get_text()
\`\`\`

**Practical build-up — a simple recon tool:**
\`\`\`python
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def enumerate_links(url):
    """Extract all links from a page."""
    try:
        r = requests.get(url, timeout=5)
        soup = BeautifulSoup(r.text, "html.parser")
        links = set()
        for a in soup.find_all("a", href=True):
            full_url = urljoin(url, a["href"])
            links.add(full_url)
        return sorted(links)
    except Exception as e:
        print(f"[-] Error: {e}")
        return []

# Test it
links = enumerate_links("https://httpbin.org")
for link in links[:10]:  # First 10
    print(link)
\`\`\`

Always set a User-Agent and timeout. Many sites block scripts without a proper User-Agent.`),

    l('py-9', 'Working with APIs & JSON',
      `Most modern services use REST APIs with JSON. Understanding how to parse and manipulate JSON is essential.

**JSON structure and Python equivalents:**
\`\`\`python
import json

# JSON string → Python dictionary
json_string = '{"name": "admin", "role": "user", "id": 1001}'
data = json.loads(json_string)
print(data["name"])     # admin
print(data["role"])     # user

# Python dictionary → JSON string
user = {
    "name": "admin",
    "role": "admin",
    "id": 1001,
    "permissions": ["read", "write", "delete"]
}
json_output = json.dumps(user, indent=2)
print(json_output)
\`\`\`

**Working with complex API responses:**
\`\`\`python
import requests
import json

# Fetch API data
r = requests.get("https://api.github.com/users/octocat/repos")
repos = r.json()

# repos is a list of dictionaries
print(f"Found {len(repos)} repositories\\n")

for repo in repos:
    print(f"Name: {repo['name']}")
    print(f"  Stars: {repo['stargazers_count']}")
    print(f"  Language: {repo.get('language', 'N/A')}")
    print(f"  URL: {repo['html_url']}\\n")
\`\`\`

**Error handling for API calls:**
\`\`\`python
import requests
import time

def call_api(url, retries=3):
    """Call an API with retry logic."""
    for attempt in range(retries):
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()  # Raise error for 4xx/5xx
            return r.json()
        except requests.exceptions.HTTPError as e:
            if r.status_code == 429:  # Rate limited
                wait = int(r.headers.get("Retry-After", 10))
                print(f"[-] Rate limited, waiting {wait}s")
                time.sleep(wait)
            else:
                print(f"[-] HTTP Error: {e}")
                return None
        except requests.exceptions.ConnectionError:
            print(f"[-] Connection failed (attempt {attempt+1}/{retries})")
            time.sleep(2)
        except Exception as e:
            print(f"[-] Error: {e}")
            return None
    return None

data = call_api("https://api.github.com/users/octocat")
if data:
    print(f"User: {data['login']} - Repos: {data['public_repos']}")
\`\`\`

**Build an API enumeration tool:**
\`\`\`python
import requests

def enumerate_api(base_url, endpoints):
    """Check if common API endpoints exist on a target."""
    results = []
    for endpoint in endpoints:
        url = f"{base_url}/{endpoint}"
        try:
            r = requests.get(url, timeout=3)
            if r.status_code == 200:
                results.append((url, r.status_code, "FOUND"))
            elif r.status_code == 403:
                results.append((url, r.status_code, "FORBIDDEN"))
            elif r.status_code == 401:
                results.append((url, r.status_code, "UNAUTHORIZED"))
        except:
            pass
    return results

# Common API endpoints to check
endpoints = [
    "api/users", "api/admin", "api/config",
    "api/v1", "api/v2", "swagger.json",
    "api-docs", "graphql", "api/health"
]

results = enumerate_api("https://httpbin.org", endpoints)
for url, status, note in results:
    print(f"[{status}] {url} ({note})")
\`\`\`

APIs are everywhere in modern web applications. Mastering them gives you access to the backend logic of almost any service.`),

    l('py-10', 'Building a Password Generator',
      `Let's build a complete tool from scratch. Start small, add features step by step.

**Step 1: Generate random passwords:**
\`\`\`python
import random
import string

def generate_password(length=12):
    """Generate a random password."""
    chars = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(chars) for _ in range(length))
    return password

print(generate_password())
print(generate_password(16))
print(generate_password(8))
\`\`\`

**Step 2: Add customization:**
\`\`\`python
import random
import string

def generate_password(length=12, use_symbols=True, use_numbers=True):
    """Generate a customizable password."""
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password

# Test different options
print(generate_password())                    # Default
print(generate_password(16, True, True))       # Long, full
print(generate_password(8, False, True))       # Letters + numbers only
print(generate_password(20, True, False))      # Long, letters + symbols
\`\`\`

**Step 3: Ensure at least one of each type:**
\`\`\`python
import random
import string

def generate_password(length=12, use_symbols=True, use_numbers=True):
    """Generate password with guaranteed character types."""
    if length < 4:
        raise ValueError("Password length must be at least 4")
    
    # Guarantee at least one of each selected type
    password = []
    password.append(random.choice(string.ascii_lowercase))
    password.append(random.choice(string.ascii_uppercase))
    
    if use_numbers:
        password.append(random.choice(string.digits))
    if use_symbols:
        password.append(random.choice(string.punctuation))
    
    # Fill the rest randomly
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    
    for _ in range(length - len(password)):
        password.append(random.choice(chars))
    
    # Shuffle to avoid predictable pattern
    random.shuffle(password)
    return ''.join(password)

# Test
for _ in range(5):
    pwd = generate_password()
    print(f"{pwd}  (length: {len(pwd)})")
\`\`\`

**Step 4: Add command-line interface:**
\`\`\`python
import random
import string
import sys

def generate_password(length=12, use_symbols=True, use_numbers=True):
    password = []
    password.append(random.choice(string.ascii_lowercase))
    password.append(random.choice(string.ascii_uppercase))
    if use_numbers:
        password.append(random.choice(string.digits))
    if use_symbols:
        password.append(random.choice(string.punctuation))
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    for _ in range(length - len(password)):
        password.append(random.choice(chars))
    random.shuffle(password)
    return ''.join(password)

# CLI interface
if __name__ == "__main__":
    length = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    for i in range(count):
        print(f"[{i+1}] {generate_password(length)}")
# Run: python3 generate.py 16 5
\`\`\`

**Step 5: Save passwords to file:**
\`\`\`python
def save_passwords(passwords, filename="generated_passwords.txt"):
    """Save passwords to a file."""
    with open(filename, "w") as f:
        for i, pwd in enumerate(passwords, 1):
            f.write(f"{i}. {pwd}\\n")
    print(f"[+] Saved {len(passwords)} passwords to {filename}")

# Generate and save
passwords = [generate_password(16) for _ in range(10)]
save_passwords(passwords)
\`\`\`

This progression shows how to build real tools: start with a simple function, add features, create a CLI, add file output. This is exactly how security tools are built.`, { hasQuiz: true, quiz: [
        { id: 'py-10-q1', question: 'What does `random.shuffle()` do to a list?', options: ['Sorts it', 'Reverses it', 'Randomizes the order', 'Removes duplicates'], correctIndex: 2, explanation: 'random.shuffle() randomly reorders the elements of a list in place.' },
        { id: 'py-10-q2', question: 'What string module attribute contains all punctuation characters?', options: ['string.punct', 'string.punctuation', 'string.special', 'string.symbols'], correctIndex: 1, explanation: 'string.punctuation contains all standard punctuation characters like !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~.' },
      ] }),
];

export const COURSE: Course = {
  id: 'python-for-hackers-101',
  title: 'Python for Hackers 101',
  categoryId: 'programming',
  description:
    'Learn Python from scratch with a security-focused mindset. Write scripts that scan, scrape, and exploit.',
  overview:
    'Python is the most versatile language in security. This course teaches you the fundamentals — variables, loops, functions, and libraries — through the lens of real hacking tools and techniques.',
  estimatedMinutes: 85,
  cpCost: 100,
  learningObjectives: [
      'Write Python scripts using variables, conditionals, and loops',
      'Work with strings, lists, and dictionaries for data handling',
      'Use the requests and socket libraries for network tasks',
      'Build a simple port scanner and HTTP request tool',
  ],
  skillLevel: 'beginner',
  popular: true,
  lessons: LESSONS,
};
