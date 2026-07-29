export const helpTexts: Record<string, string> = {
  ls: `Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).

Options:
  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list implied . and ..
  -l                         use a long listing format
  -h, --human-readable       with -l, print sizes in human readable format
  -R, --recursive            list subdirectories recursively
  -S                         sort by file size, largest first
  -t                         sort by time, newest first
  -1                         list one file per line
  -d, --directory            list directories themselves, not their contents
      --color[=WHEN]         colorize the output (WHEN=always, auto, never)
      --help                 display this help and exit`,

  cd: `cd: cd [-L|[-P [-e]] [-@]] [dir]
Change the shell working directory.

Change the current directory to DIR.  The default DIR is the value of the
HOME shell variable.

Options:
  -L        force symbolic links to be followed
  -P        use the physical directory structure without following symbolic links
      --help  display this help and exit`,

  pwd: `pwd: pwd [-LP]
Print the name of the current working directory.

Options:
  -L        print the value of $PWD if it names the current working directory
  -P        print the physical directory, without any symbolic links
      --help  display this help and exit`,

  tree: `Usage: tree [OPTION]... [PATH]...
Display directory tree of the specified path (current directory by default).

Options:
  -a            all files are printed
  -d            list directories only
  -L level      descend only level directories deep
  -h            print size in human readable format
  -s            print size in bytes
  --help        display this help and exit`,

  cat: `Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

Options:
  -n, --number             number all output lines
  -b, --number-nonblank    number nonempty output lines
  -s, --squeeze-blank      suppress repeated empty output lines
  -E, --show-ends          display $ at end of each line
  -T, --show-tabs          display TAB characters as ^I
  -A, --show-all           equivalent to -vET
      --help               display this help and exit`,

  echo: `Usage: echo [SHORT-OPTION]... [STRING]...
Echo the STRING(s) to standard output.

  -n             do not output the trailing newline
  -e             enable interpretation of backslash escapes
  -E             disable interpretation of backslash escapes
      --help     display this help and exit`,

  touch: `Usage: touch [OPTION]... FILE...
Update the access and modification times of each FILE to the current time.

Options:
  -a            change only the access time
  -m            change only the modification time
  -c, --no-create  do not create any files
  -d, --date=STRING  parse STRING and use it instead of current time
  -t STAMP      use [[CC]YY]MMDDhhmm[.ss] instead of current time
      --help    display this help and exit`,

  mkdir: `Usage: mkdir [OPTION]... DIRECTORY...
Create the DIRECTORY(ies), if they do not already exist.

Options:
  -p, --parents     no error if existing, make parent directories as needed
  -v, --verbose     print a message for each created directory
  -m, --mode=MODE   set file mode (as in chmod), not a=rwx - umask
      --help        display this help and exit`,

  rm: `Usage: rm [OPTION]... [FILE]...
Remove (unlink) the FILE(s).

Options:
  -f, --force           ignore nonexistent files and arguments, never prompt
  -r, -R, --recursive   remove directories and their contents recursively
  -v, --verbose         explain what is being done
  -i                    prompt before every removal
      --help            display this help and exit`,

  cp: `Usage: cp [OPTION]... [-T] SOURCE DEST
  or:  cp [OPTION]... SOURCE... DIRECTORY
Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.

Options:
  -a, --archive               same as -dR --preserve=all
  -r, -R, --recursive         copy directories recursively
  -v, --verbose               explain what is being done
  -f, --force                 if an existing destination file cannot be opened
  -i, --interactive           prompt before overwrite
  -n, --no-clobber            do not overwrite an existing file
  -u, --update                copy only when the SOURCE file is newer
      --help                  display this help and exit`,

  mv: `Usage: mv [OPTION]... [-T] SOURCE DEST
  or:  mv [OPTION]... SOURCE... DIRECTORY
Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.

Options:
  -f, --force                 do not prompt before overwriting
  -i, --interactive           prompt before overwrite
  -n, --no-clobber            do not overwrite an existing file
  -v, --verbose               explain what is being done
  -u, --update                move only when the SOURCE file is newer
      --help                  display this help and exit`,

  chmod: `Usage: chmod [OPTION]... MODE[,MODE]... FILE...
  or:  chmod [OPTION]... OCTAL-MODE FILE...
Change the mode of each FILE to MODE.

Options:
  -R, --recursive        change files and directories recursively
  -v, --verbose          output a diagnostic for every file processed
  -c, --changes          like verbose but report only when a change is made
      --help             display this help and exit`,

  head: `Usage: head [OPTION]... [FILE]...
Print the first 10 lines of each FILE to standard output.

Options:
  -n, --lines=[-]NUM       print the first NUM lines instead of 10
  -c, --bytes=[-]NUM       print the first NUM bytes of each file
  -v, --verbose            always output headers giving file names
  -q, --quiet              never output headers giving file names
      --help               display this help and exit`,

  tail: `Usage: tail [OPTION]... [FILE]...
Print the last 10 lines of each FILE to standard output.

Options:
  -n, --lines=NUM           output the last NUM lines, instead of the last 10
  -f, --follow              output appended data as the file grows
  -c, --bytes=NUM           output the last NUM bytes
  -v, --verbose             always output headers giving file names
  -q, --quiet               never output headers giving file names
      --help                display this help and exit`,

  wc: `Usage: wc [OPTION]... [FILE]...
Print newline, word, and byte counts for each FILE.

Options:
  -c, --bytes          print the byte counts
  -m, --chars          print the character counts
  -l, --lines          print the newline counts
  -w, --words          print the word counts
  -L, --max-line-length  print the maximum display width
      --help           display this help and exit`,

  grep: `Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.

Options:
  -i, --ignore-case         ignore case distinctions
  -v, --invert-match        select non-matching lines
  -c, --count               print only a count of matching lines
  -l, --files-with-matches  print only names of files with matches
  -n, --line-number         print line number with output lines
  -r, --recursive           read all files under each directory recursively
  -w, --word-regexp         match only whole words
  -E, --extended-regexp     PATTERNS are extended regular expressions
  -F, --fixed-strings       PATTERNS are strings
  -B, --before-context=NUM  print NUM lines of leading context
  -A, --after-context=NUM   print NUM lines of trailing context
  -C, --context=NUM          print NUM lines of output context
      --color=WHEN          use markers to highlight the matching strings
      --help                display this help and exit`,

  find: `Usage: find [-H] [-L] [-P] [-D debugopts] [-Olevel] [starting-point...] [expression]
Search for files in a directory hierarchy.

Options:
  -name pattern         base of file name matches shell pattern
  -type [fdl]           file is of type f (file), d (directory), l (symlink)
  -size [+-]n[cwbkMG]  file uses n units of space
  -perm mode            file's permission bits are exactly mode
  -user uname           file is owned by user uname
  -maxdepth levels      descend at most levels levels of directories
  -mindepth levels      do not apply any tests at levels less than levels
  -path pattern         file name matches shell pattern
  -not                  negate the expression
      --help            display this help and exit`,

  sort: `Usage: sort [OPTION]... [FILE]...
Write sorted concatenation of all FILE(s) to standard output.

Options:
  -r, --reverse             reverse the result of comparisons
  -n, --numeric-sort        compare according to string numerical value
  -u, --unique              output only the first of an equal run
  -f, --ignore-case         fold lower case to upper case characters
  -h, --human-numeric-sort  compare human readable numbers
  -t, --field-separator=SEP  use SEP instead of non-blank to blank transition
  -k, --key=KEY             sort via a key
      --help                display this help and exit`,

  diff: `Usage: diff [OPTION]... FILES...
Compare FILES line by line.

Options:
  -i, --ignore-case       ignore case differences in file contents
  -u, -U NUM              output NUM lines of unified context
  -c, -C NUM              output NUM lines of copied context
  -r, --recursive         recursively compare any subdirectories found
  -q, --brief             report only when files differ
  -s, --report-identical-files  report when two files are the same
      --help              display this help and exit`,

  ln: `Usage: ln [OPTION]... [-T] TARGET LINK_NAME
  or:  ln [OPTION]... TARGET... DIRECTORY
Make links between files.

Options:
  -s, --symbolic           make symbolic links instead of hard links
  -f, --force              remove existing destination files
  -v, --verbose            print name of each linked file
  -n, --no-dereference     treat LINK_NAME as a normal file if it is a symlink
      --help               display this help and exit`,

  du: `Usage: du [OPTION]... [FILE]...
Summarize disk usage of the set of FILE(s), recursively for directories.

Options:
  -h, --human-readable     print sizes in human readable format
  -s, --summarize          display only a total for each argument
  -a, --all                write counts for all files, not just directories
  -c, --total              produce a grand total
  -d, --max-depth=N        print the total for a directory only if it is N levels below
      --help               display this help and exit`,

  df: `Usage: df [OPTION]... [FILE]...
Show information about the file system on which each FILE resides.

Options:
  -h, --human-readable     print sizes in powers of 1024
  -T, --print-type         print file system type
  -a, --all                include dummy file systems
  -i, --inodes             list inode information instead of block usage
  -k                       use 1024-byte blocks
      --help               display this help and exit`,

  tar: `Usage: tar [OPTION...] [FILE]...
GNU 'tar' saves many files together into a single tape or disk archive.

Options:
  -c, --create               create a new archive
  -x, --extract              extract files from an archive
  -t, --list                 list the contents of an archive
  -f, --file=ARCHIVE         use archive file or device ARCHIVE
  -v, --verbose              verbosely list files processed
  -z, --gzip                 filter the archive through gzip
  -j, --bzip2                filter the archive through bzip2
  -C, --directory=DIR        change to DIR before performing any operations
      --help                 display this help and exit`,

  whoami: `Usage: whoami [OPTION]...
Print the user name associated with the current effective user ID.

      --help     display this help and exit`,

  id: `Usage: id [OPTION]... [USER]
Print user and group information for the specified USER, or for the current user.

Options:
  -u            print only the effective user ID
  -g            print only the effective group ID
  -G            print all group IDs
  -n            print a name instead of a number
  -r            print the real ID instead of the effective ID
      --help    display this help and exit`,

  uname: `Usage: uname [OPTION]...
Print certain system information.

Options:
  -a, --all                print all information
  -s, --kernel-name        print the kernel name
  -n, --nodename           print the network node hostname
  -r, --kernel-release     print the kernel release
  -v, --kernel-version     print the kernel version
  -m, --machine            print the machine hardware name
  -p, --processor          print the processor type
  -i, --hardware-platform  print the hardware platform
  -o, --operating-system   print the operating system
      --help               display this help and exit`,

  date: `Usage: date [OPTION]... [+FORMAT]
  or:  date [-u|--utc|--universal] [MMDDhhmm[[CC]YY][.ss]]
Display the current time in the given FORMAT, or set the date.

Options:
  -d, --date=STRING          display time described by STRING
  -u, --utc, --universal     print or set Coordinated Universal Time
  -R, --rfc-2822             output date and time in RFC 2822 format
  -I[FMT], --iso-8601[=FMT]  output date/time in ISO 8601 format
      --help                 display this help and exit`,

  cal: `Usage: cal [OPTION]... [MONTH] [YEAR]
Display a calendar, with the current day highlighted.

Options:
  -1, --one             show single month (default)
  -3, --three           show three months (previous, current, next)
  -y, --year            show the whole year
  -j, --julian          show Julian calendar dates
  -m, --monday          make Monday the first day of the week
  -s, --sunday          make Sunday the first day of the week
      --help            display this help and exit`,

  ps: `Usage: ps [OPTION]...
Report a snapshot of the current processes.

Options:
  aux          BSD style to show all processes
  -e           select all processes
  -f           do full-format listing
  -u userlist  select by effective user ID or name
  -p pidlist   select by PID
      --help   display this help and exit`,

  kill: `Usage: kill [OPTIONS] [PID]...
Send a signal to a process.

Options:
  -l, --list            list signal names
  -s, --signal SIGNAL   specify the signal to be sent
  -n NUMBER             signal number
  -9                    SIGKILL (force kill)
      --help            display this help and exit`,

  sudo: `Usage: sudo -h | -K | -k | -V
Usage: sudo -v [-AknS] [-g group] [-h host] [-p prompt] [-u user]
Usage: sudo -l [-AknS] [-g group] [-h host] [-p prompt] [-U user] [-u user] [command]
Usage: sudo [-AbklnS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt] [-T timeout] [-u user] [VAR=value] [-i|-s] [<command>]
Usage: sudoedit [-AknS] [-C num] [-g group] [-h host] [-p prompt] [-T timeout] [-u user] file ...

Options:
  -u, --user=USER       run command as specified user
  -i, --login           run login shell as the target user
  -s, --shell           run shell as the target user
  -k, --reset-timestamp invalidate timestamp file
  -l, --list            list user's privileges
      --help            display this help and exit`,

  free: `Usage: free [OPTION]...
Display amount of free and used memory in the system.

Options:
  -b, --bytes         show output in bytes
  -k, --kilo          show output in kilobytes
  -m, --mega          show output in megabytes
  -g, --giga          show output in gigabytes
  -h, --human         show human-readable output
  -t, --total         show total for RAM + swap
  -s, --seconds N     repeat printing every N seconds
      --help          display this help and exit`,

  ping: `Usage: ping [OPTION]... DESTINATION
Send ICMP ECHO_REQUEST to network hosts.

Options:
  -c COUNT          stop after sending COUNT packets
  -i INTERVAL       wait INTERVAL seconds between sending each packet
  -s PACKETSIZE     specify the number of data bytes to be sent
  -t TTL            set the IP Time to Live
  -W TIMEOUT        time to wait for a response, in seconds
  -4                use IPv4
  -6                use IPv6
      --help        display this help and exit`,

  curl: `Usage: curl [OPTION...] URL
Transfer a URL.

Options:
  -s, --silent           silent mode
  -S, --show-error       show errors even when silent
  -o, --output FILE      write to file instead of stdout
  -O, --remote-name      write output to a file named as the remote file
  -L, --location         follow redirects
  -u, --user USER:PWD    server user and password
  -X, --request COMMAND  specify request command to use
  -d, --data DATA        HTTP POST data
  -H, --header HEADER    pass custom header to server
  -k, --insecure         allow insecure server connections
  -v, --verbose          make the operation more talkative
      --help             display this help and exit`,

  nmap: `Nmap 7.94SVN ( https://nmap.org )
Usage: nmap [Scan Type(s)] [Options] {target specification}

TARGET SPECIFICATION:
  Can pass hostnames, IP addresses, networks, etc.
  Ex: scanme.nmap.org, 192.168.1.0/24, 10.0.0-255.1-100
  -iL <inputfilename>    Input from list of hosts/networks
  -iR <num hosts>        Choose random targets
      --exclude <host1[,host2]>  Exclude hosts/networks
      --excludefile <exclude_file>  Exclude list from file

HOST DISCOVERY:
  -sL      List Scan - simply list targets and exit
  -sn      Ping Scan - disable port scan
  -Pn      Treat all hosts as online -- skip host discovery

SCAN TECHNIQUES:
  -sS/sT/sA/sW/sM  TCP SYN/Connect()/ACK/Window/Maimon scans
  -sU              UDP Scan
  -sV              Probe open ports to determine service/version info
  -sC              equivalent to --script=default
  -O               Enable OS detection

PORT SPECIFICATION AND SCAN ORDER:
  -p <port ranges>  Only scan specified ports
  -F               Fast mode - Scan fewer ports than the default scan
  -p-               Scan all ports (1-65535)

SERVICE/VERSION DETECTION:
  -sV              Probe open ports to determine service/version info
      --version-intensity <level>  Set from 0 (light) to 9 (try all probes)

OS DETECTION:
  -O               Enable OS detection
      --osscan-guess  Guess OS more aggressively

TIMING AND PERFORMANCE:
  -T<0-5>          Set timing template (higher is faster)
  --min-rate <num>  Send packets no slower than <num> per second
  --max-rate <num>  Send packets no faster than <num> per second

OUTPUT:
  -oN/-oX/-oS/-oG <file>  Output scan in normal, XML, s|<rIpt kIddi3, and Grepable format
  -oA <basename>   Output in the three major formats at once
  -v               Increase verbosity level
  -d               Increase debugging level

MISC:
  -6              Enable IPv6 scanning
  -A              Aggressive scan options (OS detection, version detection, script scanning, traceroute)
      --resume <filename>  Resume an aborted scan
      --help       Print this help summary page

EXAMPLES:
  nmap -v -A scanme.nmap.org
  nmap -v -sn 192.168.1.0/24
  nmap -v -sS -O 10.0.0.1
  nmap --help  for more options

SEE: https://nmap.org/book/man.html`,

  netstat: `Usage: netstat [OPTION]...
Print network connections, routing tables, interface statistics, etc.

Options:
  -r, --route            display routing table
  -i, --interfaces       display interface table
  -g, --groups           display multicast group memberships
  -s, --statistics       display networking statistics
  -t, --tcp              display TCP connections
  -u, --udp              display UDP connections
  -l, --listening        display listening server sockets
  -a, --all              display all sockets
  -n, --numeric          don't resolve names
  -p, --programs         display PID/Program name for sockets
      --help             display this help and exit`,

  dig: `Usage: dig [@global-server] [domain] [q-type] [q-class] {q-opt}
  {global-d-opt} host [@local-server] {local-d-opt}
  [ host [@local-server] {local-d-opt} [...]]

Where TYPE is one of: A, AAAA, MX, NS, TXT, CNAME, SOA, PTR, etc.
Global options: +cmd, +short, +noall, +answer, +trace, +identify, +stats

Options:
  @server          specify the DNS server to query
  -x IP            reverse lookup
  +short           concise reply
  +trace           trace the delegation path
  +noall +answer   show only the answer section
  -4               use IPv4
  -6               use IPv6
      --help       display this help and exit`,

  whois: `Usage: whois [OPTION]... QUERY...
Whois client for the whois directory service.

Options:
  -h HOST, --host HOST    connect to server HOST
  -p PORT, --port PORT    connect to PORT
  -I, --use-whowas        use Whowas service for more accurate results
  -H                      hide legal disclaimers
      --help              display this help and exit`,

  ss: `Usage: ss [ OPTIONS ]
ss - utility to investigate sockets.

Options:
  -t, --tcp           display only TCP sockets
  -u, --udp           display only UDP sockets
  -l, --listening     display listening sockets
  -a, --all           display all sockets
  -n, --numeric       don't resolve service names
  -p, --processes     show process using socket
  -s, --summary       print summary statistics
  -e, --extended      show detailed socket information
  -4                  display only IPv4 sockets
  -6                  display only IPv6 sockets
      --help          display this help and exit`,

  traceroute: `Usage: traceroute [OPTION]... HOST
Print the route packets trace to network host.

Options:
  -f, --first-hop=NUM    set initial hop distance
  -m, --max-hop=NUM      set maximum hop distance
  -n, --numeric           do not resolve host names
  -p, --port=PORT         use specified destination port
  -q, --tries=NUM         set number of probe attempts per hop
  -w, --wait=TIME         set time to wait for response
  -4                      use IPv4
  -6                      use IPv6
      --help               display this help and exit`,

  arp: `Usage: arp [OPTION]... [HOSTNAME]
Manipulate the system ARP cache.

Options:
  -a, --all           display all entries
  -d, --delete        delete an entry
  -s, --set           set a new ARP entry
  -n, --numeric       don't resolve names
  -v, --verbose       verbose output
  -i, --device IF     specify network interface
      --help          display this help and exit`,

  ip: `Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }
       ip [ -force ] -batch filename
where  OBJECT := { link | address | addrlabel | route | rule | neigh | 
                  tunnel | maddress | mroute | monitor | xfrm | netns |
                  l2tp | tcp_metrics | token }

OPTIONS:
  -V, --Version        print version information
  -s, --statistics     output more statistics
  -d, --details        output more detailed information
  -r, --resolve        use the system's name resolver to print names
  -h, --human          append human-readable suffix
  -b, --batch          read commands from file
      --help           display this help and exit`,

  wget: `Usage: wget [OPTION]... [URL]...
GNU Wget - the non-interactive network downloader.

Options:
  -O, --output-document=FILE    write documents to FILE
  -c, --continue                resume getting a partially-downloaded file
  -q, --quiet                   quiet (no output)
  -v, --verbose                 be verbose (this is the default)
  -P, --directory-prefix=PREFIX  save files to PREFIX/...
  -r, --recursive               specify recursive download
  -l, --level=NUMBER            maximum recursion depth
  -np, --no-parent              don't ascend to the parent directory
      --help                    display this help and exit`,

  scp: `Usage: scp [-346Clpqv] [-c cipher] [-F ssh_config] [-i identity_file]
             [-J destination] [-l limit] [-o ssh_option] [-P port]
             [-S program] source ... target
Secure copy (remote file copy program).

Options:
  -P port             specifies the port to connect to on the remote host
  -p                  preserves modification times and modes
  -q                  quiet mode
  -r                  recursively copy entire directories
  -v                  verbose mode
  -C                  enable compression
  -l limit            limits bandwidth usage
  -3                  Copies between two remote hosts
      --help          display this help and exit`,

  ssh: `Usage: ssh [OPTION...] [user@]hostname [command]
OpenSSH remote login client.

Options:
  -p port              port to connect to on the remote host
  -l login             login user name
  -i identity_file     identity (private key) file
  -v                   verbose mode
  -4                   use IPv4 only
  -6                   use IPv6 only
  -A                   enable forwarding of authentication agent
  -X                   enable X11 forwarding
  -C                   request compression
  -o option            can be used to pass options to ssh
  -J destination       jump host
      --help           display this help and exit`,

  gobuster: `Usage: gobuster [command] [flags]
Gobuster is a tool to brute-force URIs, DNS subdomains, virtual host names.

Commands:
  dir       Uses directory/file enumeration mode
  dns       Uses DNS subdomain lookup mode
  vhost     Uses VHOST enumeration mode

Flags:
  -u, --url URL                    The target URL
  -w, --wordlist PATH              Path to the wordlist
  -t, --threads NUM                Number of concurrent threads (default 10)
  -x, --extensions EXT             File extension(s) to try
  -s, --status-codes CODES         Positive status codes (default 200,204,301,302,307,401,403)
  -c, --cookies STRING             Cookies to use for the requests
  -n, --no-status                  Don't print status codes
  -v, --verbose                    Verbose output
  -k, --no-tls-validation          Skip TLS certificate verification
      --help                       display this help and exit`,

  hydra: `Usage: hydra [[[-l LOGIN|-L FILE] [-p PASS|-P FILE]] | [-C FILE]] [-e nsr]
           [-o FILE] [-t TASKS] [-M FILE [-T TASKS]] [-w TIME] [-W TIME] [-f]
           [-s PORT] [-x MIN:MAX:CHARSET] [-SuvVdNS] [service://server[:PORT][/OPTIONS]]

Hydra v9.6 (c) 2022 by van Hauser/THC & David Maciejak

Options:
  -l LOGIN           login name
  -L FILE            login list file
  -p PASS            password to try
  -P FILE            password list file
  -C FILE            combination file of login:pass
  -t TASKS           run TASKS connections per target (default: 16)
  -s PORT            connect to target on specified port
  -S                 connect via SSL
  -v                 verbose mode
  -V                 show login+pass for each attempt
  -f                 exit after first found login/password pair
  -e nsr             try "n" null, "s" login as pass, "r" reverse login
  -w TIME            set max wait time for responses
  -o FILE            write found login/password pairs to file
  -u                 loop around users, not passwords
      --help         display this help and exit`,

  sqlmap: `Usage: sqlmap [options]
sqlmap - automatic SQL injection and database takeover tool

Options:
  -u URL, --url=URL         Target URL
  --data=DATA               Data string to be sent through POST
  --cookie=COOKIE           HTTP Cookie header value
  --user-agent=AGENT        HTTP User-Agent header value
  -p TESTPARAMETER          Testable parameter(s)
  --dbms=DBMS               Force back-end DBMS to provided value
  --level=LEVEL             Level of tests to perform (1-5, default 1)
  --risk=RISK               Risk of tests to perform (1-3, default 1)
  --threads=THREADS         Number of threads
  --batch                   Never ask for user input, use the default behavior
  --dump                    Dump DBMS table data entries
  --tables                  Enumerate DBMS database tables
  --columns                 Enumerate DBMS database table columns
  -D DB                     DBMS database to enumerate
  -T TBL                    DBMS database table to enumerate
  --os-shell                Prompt for an interactive shell
  -v VERBOSE                Verbosity level (0-6)
      --help                display this help and exit`,

  nikto: `Usage: nikto -h <target> [options]
nikto - web server scanner

Options:
  -h, --host TARGET       Target host (IP or hostname)
  -p, --port PORT         Target port (default 80)
  -ssl                    Force SSL mode
  -c, --cgidirs CGI       Scan these CGI directories
  -id+                    HTTP authentication
  -output FILE            Write output to file
  -Format FORMAT          Output format (csv, html, txt, xml)
  -evasion STYLE          Encoding evasion
  -Tuning                 Scan tuning
  -list-plugins           List all available plugins
  -v, --verbose           Verbose output
  -Display                Display options
      --help              display this help and exit`,

  john: `John the Ripper 1.9.0-jumbo-1 OMP [linux-gnu 64-bit x86_64]
Usage: john [OPTIONS] [PASSWORD-FILES]

Options:
  --wordlist=FILE         Wordlist mode, read words from FILE
  --single                Single crack mode
  --incremental[=MODE]    Incremental mode [using MODE]
  --rules[=RULES]         Enable wordlist rules
  --stdin                 Read wordlist from stdin
  --show[=LEFT]           Show cracked passwords
  --format=NAME           Force hash type (e.g., raw-md5, bcrypt, sha512crypt)
  --session=NAME          Give a new session a NAME
  --restore[=NAME]        Restore an interrupted session
  --status[=NAME]         Print status of a running session
  --pot=NAME              Pot file to use
  --fork=N                Fork N processes
  -p, --skip=NUM          Skip NUM iterations
  --users=[-]LOGIN|UID    Filter users
  --groups=[-]GID         Filter groups
  -t, --test              Run benchmark
  -v, --verbose           Verbose mode
      --help              display this help and exit`,

  searchsploit: `Usage: searchsploit [OPTIONS] term1 [term2] ...
SearchSploit - Exploit Database Search Tool
  SearchSploit allows you to search the Exploit Database.

Options:
  -c, --case [term]       Case-sensitive search (Default is inSEnsITiVe)
  -e, --exact             Perform an exact match search
  -t, --title [term]      Search JUST the exploit title
  -w, --www               Show URLs to exploit-db.com
  -p, --path [EDB-ID]     Show the full path to an exploit
  -m, --mirror [EDB-ID]   Mirror (copy) an exploit
  -o, --overflow          Exploit titles are allowed to overflow the columns
      --help              display this help and exit`,

  enum4linux: `Usage: enum4linux [OPTIONS] TARGET
enum4linux - enumerate information from Windows and Samba systems.

Options:
  -U             get userlist
  -S             get sharelist
  -P             get password policy information
  -G             get group and member list
  -d             detailed info
  -n             do an nmblookup (NetBIOS name lookup)
  -a             do all simple enumeration
  -v             verbose
  -w WORKGROUP   specify workgroup/domain
  -l LOGIN       specify login username
  -p PASS        specify login password
      --help     display this help and exit`,

  smbclient: `Usage: smbclient [OPTIONS] service <password>
  smbclient -L <host>
SMB client - to access SMB/CIFS resources on servers.

Options:
  -L, --list HOST           list shares on HOST
  -U, --user USERNAME       connect as USERNAME
  -W, --workgroup GROUP     workgroup
  -N, --no-pass             do not ask for a password
  -p, --port PORT           connect to specified port
  -d, --debug=LEVEL         debug level
  -c, --command STRING      execute semicolon separated commands
  -M, --message HOST        send a message
      --help                display this help and exit`,

  crackmapexec: `Usage: crackmapexec [OPTIONS] TARGET COMMAND
CrackMapExec - Swiss Army Knife for pentesting networks.

Options:
  -u USERNAME        username(s) or file with usernames
  -p PASSWORD        password(s) or file with passwords
  -d DOMAIN          domain name
  --local-auth       authenticate locally to each host
  -x COMMAND         execute WMI command
  -X PS_CMD          execute PowerShell command
  --sam              dump SAM hashes
  --lsa              dump LSA secrets
  --shares           enumerate shares
  --sessions         enumerate active sessions
  --disks            enumerate disks
  -t THREADS         number of threads
  -v                 verbose mode
      --help         display this help and exit`,

  hashcat: `Usage: hashcat [OPTIONS]... HASHFILE [MASK|DICTIONARY]
hashcat - advanced password recovery tool

Options:
  -m, --hash-type=NUM       Hash type (see --example-hashes for list)
  -a, --attack-mode=NUM     Attack mode (0=straight, 1=combination, 3=brute-force, 6=hybrid)
  -o, --outfile=FILE        Output cracked passwords to FILE
  -r, --rules-file=FILE     Use rules from FILE
  -i, --increment           Enable incremental mode
  --increment-min=NUM       Start increment at NUM
  --increment-max=NUM       Stop increment at NUM
  -w, --workload-prof=NUM   Workload profile (1-4, default 2)
  -s, --skip=NUM            Skip NUM seconds
  -l, --status              Enable status screen updates
  --force                   Ignore warnings
  --show                    Show cracked passwords only
  --example-hashes          Show a list of example hash types
  -b, --benchmark           Run benchmark
      --help                display this help and exit`,

  exiftool: `Usage: exiftool [OPTIONS] FILE
ExifTool - Read and write meta information in files.

Options:
  -a              allow duplicate tags to be extracted
  -b              output tag values in binary format
  -d FORMAT       set date format
  -e              extract embedded documents
  -r              recursive
  -g[NUM]         organize output by tag group
  -h              show hex dump of tag
  -j              output as JSON
  -l              long output
  -list           print all tag names
  -s[NUM]         shorten output
  -t              output as table
  -u              extract unknown information
  -v[NUM]         verbose mode
  -w EXT          write extracted files to directory
  -x TAG          exclude specified tag
  --help          display this help and exit`,

  binwalk: `Usage: binwalk [OPTIONS] [FILE]...
Binwalk - Firmware Analysis Tool

Options:
  -B, --signature            Scan for common file signatures
  -e, --extract              Automatically extract known file types
  -M, --matryoshka           Recursively scan extracted files
  -d, --depth=<int>          Limit recursion depth (default: 8 levels deep)
  -D, --dd=<type:ext:cmd>   Extract <type> signatures, give the file an extension of <ext>, and execute <cmd>
  -f, --log=<file>           Log results to file
  -h, --help                 Show help output
  -I, --intense              Scan with intense heuristics
  -m, --magic=<file>         Specify a custom magic file
  -n, --ndefine              Scan for invalid/non-standard signatures
  -o, --offset=<int>         Start scanning at this file offset
  -q, --quick                Only scan for common signatures
  -r, --rm                   Clean extracted files after scanning
  -T, --time=<int>           Set CPU limit in percentage
  -y, --yara=<rule>          Use YARA rules for scanning`,

  msfconsole: `Usage: msfconsole [OPTIONS]
Metasploit Framework console - 6.4.3-dev

Options:
  -q, --quiet             Do not display the banner on startup
  -r, --resource FILE     Execute resource file
  -x, --execute-command   Execute a command when the console starts
  -f, --force             Force the console to run
  -v, --version           Show version information
      --help              display this help and exit`,

  nslookup: `Usage: nslookup [OPTION]... [HOST] [SERVER]
Query Internet name servers interactively.

Options:
  -type=TYPE         query record type (A, AAAA, MX, TXT, CNAME, etc.)
  -debug             show debug information
  -port=PORT         specify port number
  -timeout=NUM       specify timeout in seconds
      --help         display this help and exit`,

  ifconfig: `Usage: ifconfig [-a] [-v] [-s] <interface> [<address>]
Configure a network interface.

Options:
  -a                display all interfaces which are currently available
  -s                display a short list (like netstat -i)
  -v                be more verbose
  up                activate the interface
  down              shut the interface down
  inet addr         set the IP address
  netmask mask      set the netmask
  broadcast addr    set the broadcast address
      --help        display this help and exit`,

  tcpdump: `Usage: tcpdump [-AbdEllhHIKlMNOpqrStuUvxX#] [ -B size ] [ -c count ]
           [ -C file_size ] [ -E algo:secret ] [ -F file ] [ -G rotate_seconds ]
           [ -i interface ] [ -j tstamp_type ] [ -m module ] [ -M secret ]
           [ --length-tag ] [ -Q packet-metadata-filter ] [ -r file ]
           [ -s snaplen ] [ -T type ] [ -w file ] [ -W filecount ]
           [ -y datalinktype ] [ --time-stamp-precision precision ]
           [ --immediate-mode ] [ -z postrotate-command ] [ -Z user ]
           [ expression ]

Dump traffic on a network.

Options:
  -i interface         listen on specified interface
  -n                   don't resolve host addresses
  -nn                  don't resolve protocol and port names
  -v, -vv, -vvv        verbose output
  -X                   hex and ASCII dump
  -A                   print each packet in ASCII
  -s snaplen           set snaplen (default 262144)
  -c count             exit after receiving count packets
  -w file              write packets to file
  -r file              read packets from file
      --help           display this help and exit`,

  python3: `Usage: python3 [OPTION]... [-c cmd | -m mod | file | -] [args]
Python 3.11.8 interpreter.

Options:
  -c cmd         program passed in as string (terminates option list)
  -m mod         run library module as a script
  -V, --version  print the Python version number and exit
  -h, --help     print this help message and exit`,

  node: `Usage: node [OPTIONS] [ -e script | script.js ] [arguments]
Node.js v20.11.1 runtime.

Options:
  -v, --version            print Node.js version
  -e, --eval script        evaluate script
  -p, --print script       evaluate and print script
  -c, --check              syntax check script
  -i, --interactive        always enter REPL
  -r, --require module     module to preload
      --help               display this help and exit`,

  git: `usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           [--super-prefix=<path>] [--config-env=<name>=<envvar>]
           <command> [<args>]

These are common Git commands used in various situations:

start a working area (see also: git help tutorial)
  clone     Clone a repository into a new directory
  init      Create an empty Git repository or reinitialize an existing one

work on the current change (see also: git help everyday)
  add       Add file contents to the index
  mv        Move or rename a file, a directory, or a symlink
  rm        Remove files from the working tree and from the index

examine the history and state (see also: git help revisions)
  log       Show commit logs
  status    Show the working tree status
  diff      Show changes between commits, commit and working tree, etc

grow, mark and tweak your common history
  branch    List, create, or delete branches
  checkout  Switch branches or restore working tree files
  commit    Record changes to the repository
  merge     Join two or more development histories together
  tag       Create, list, delete or verify a tag object

collaborate (see also: git help workflows)
  fetch     Download objects and refs from another repository
  pull      Fetch from and integrate with another repository or a local branch
  push      Update remote refs along with associated objects

'git help -a' and 'git help -g' list available subcommands and concepts.
See 'git help <command>' or 'git help <concept>' to read about a specific
subcommand or concept.`,

  pip: `Usage: pip <command> [options]
pip - Python package installer

Commands:
  install                    Install packages
  download                   Download packages
  uninstall                  Uninstall packages
  freeze                     Output installed packages in requirements format
  list                       List installed packages
  show                       Show information about installed packages
  check                      Verify installed packages have compatible dependencies
  search                     Search PyPI for packages
  cache                      Inspect and manage pip's wheel cache
  help                       Show help for commands

General Options:
  -h, --help                 Show help
  --version                  Show version
  -v, --verbose              Give more output
  -q, --quiet                Give less output
      --proxy PROXY          Specify a proxy in the form [user:passwd@]proxy.server:port`,

  apt: `apt 2.7.6 (amd64)
Usage: apt [options] command

CLI for apt (Advanced Package Tool).
Basic commands:
  list           list packages based on package names
  search         search in package descriptions
  show           show package details
  install        install packages
  reinstall      reinstall packages
  remove         remove packages
  purge          remove packages and config files
  update         update list of available packages
  upgrade        upgrade the system by installing/upgrading packages
  full-upgrade   upgrade the system by removing/installing/upgrading packages
  edit-sources   edit the source information file
  satisfy        satisfy dependency strings

Options:
  -h, --help              show this help message
  -y, --yes               assume yes to prompts
  -q, --quiet             quiet mode
  -d, --download-only     download only
  -s, --simulate          simulate actions
  -V, --verbose-version   show full version information
      --help              display this help and exit`,

  npm: `Usage: npm <command>

where <command> is one of:
  access, adduser, audit, bin, bugs, cache, ci, completion,
  config, dedupe, deprecate, diff, dist-tag, docs, doctor,
  edit, exec, explain, explore, find-dupes, fund, get, help,
  help-search, hook, init, install, install-ci-test,
  install-test, link, ll, login, logout, ls, org, outdated,
  owner, pack, ping, pkg, prefix, profile, prune, publish,
  query, rebuild, repo, restart, root, run-script, search,
  set, shrinkwrap, star, stars, start, stop, team, test,
  token, uninstall, unpublish, unstar, update, version, view,
  whoami

npm <command> -h  quick help on <command>
npm -l            display full usage info
npm help <term>   search for help on <term>
npm help npm      more involved overview

Options:
  -h, --help         display this help and exit
  -v, --version      display npm version
  --loglevel=level   log level (silent, error, warn, notice, http, timing, info, verbose, silly)`,

  docker: `Usage: docker [OPTIONS] COMMAND
Docker - container management tool.

Management Commands:
  builder     Manage builds
  compose*    Docker Compose (Docker Inc., v2.24.0)
  config      Manage Docker configs
  container   Manage containers
  image       Manage images
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a registry
  logout      Log out from a registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker COMMAND --help' for more information on a command.`,

  tmux: `usage: tmux [-ClLv] [-c shell-command] [-f file] [-S socket-path]
            [-T terminal] [command [flags]]
tmux - terminal multiplexer.

Commands:
  new, new-session          Create a new session
  ls, list-sessions         List sessions
  attach, attach-session    Attach to a session
  kill-session              Kill a session
  detach                    Detach from a session
  new-window                Create a new window
  split-window              Split a window into two panes
  select-pane               Select a pane
  send-keys                 Send key presses to a pane
  set, set-option           Set a session option
  setw, set-window-option   Set a window option

Options:
  -c shell-command    execute shell-command
  -f file             specify configuration file
  -l                  be login shell
  -S socket-path      specify socket path
  -v                  verbose
  -V                  show version
      --help          display this help and exit`,

  make: `Usage: make [OPTIONS] [TARGET]...
GNU Make 4.3 - utility to build and maintain groups of programs.

Options:
  -b, -m                      Ignored for compatibility
  -B, --always-make           Unconditionally make all targets
  -C DIRECTORY, --directory=DIRECTORY  Change to DIRECTORY before doing anything
  -f FILE, --file=FILE        Read FILE as a makefile
  -j, --jobs=N                Allow N jobs at once; infinite jobs with no arg
  -l, --load-average=N        Don't start multiple jobs unless load is below N
  -k, --keep-going            Keep going when some targets can't be made
  -n, --just-print            Don't actually run any commands; just print them
  -o FILE, --old-file=FILE    Consider FILE to be very old and don't remake it
  -p, --print-data-base       Print make's internal database
  -q, --question              Run no commands; exit status says if up to date
  -r, --no-builtin-rules      Disable the built-in implicit rules
  -s, --silent, --quiet       Silent operation
  -S, --no-keep-going         Turns off -k
  -t, --touch                 Touch files instead of running recipes
  -v, --version               Print the version number of make
  -w, --print-directory       Print the current directory
      --help                  display this help and exit`,

  gcc: `Usage: gcc [OPTIONS]... INFILES...
GNU Compiler Collection (GCC) 12.2.0.

Options:
  -E                Preprocess only; do not compile, assemble or link
  -S                Compile only; do not assemble or link
  -c                Compile and assemble, but do not link
  -o FILE           Place the output into FILE
  -I DIR            Add DIR to search path for header files
  -L DIR            Add DIR to search path for libraries
  -l LIB            Search the library LIB when linking
  -O, -O0, -O1, -O2, -O3  Optimization level
  -g                Generate debug information
  -Wall             Enable most warning messages
  -Wextra           Enable extra warning flags
  -Werror           Treat all warnings as errors
  -std=STANDARD     Language standard (c89, c99, c11, c17, c23, gnu11, etc.)
  -v                Display the programs invoked by the compiler
  --version         Display compiler version information
      --help        display this help and exit`,

  upx: `Usage: upx [OPTION]... FILE...
Ultimate Packer for eXecutables.

Options:
  -1..-9            compression level
  -d                decompress
  -l                list compressed file
  -t                test compressed file
  -V                display version number
  -o FILE           write output to FILE
  --best            compress best (can be slow for big files)
  --faster          compress faster
  --no-color        suppress colored output
  --help            display this help and exit`,

  objdump: `Usage: objdump [OPTION]... FILE...
Display information from object files.

Options:
  -a, --archive-headers    Display archive header information
  -d, --disassemble        Display assembler contents of executable sections
  -D, --disassemble-all    Display assembler contents of all sections
  -f, --file-headers       Display the contents of the overall file header
  -h, --section-headers    Display the contents of the section headers
  -p, --private-headers    Display object format specific file header contents
  -r, --reloc              Display the relocation entries in the file
  -s, --full-contents      Display the full contents of all sections
  -S, --source             Intermix source code with disassembly
  -t, --syms               Display the contents of the symbol table
  -T, --dynamic-syms       Display the contents of the dynamic symbol table
  -x, --all-headers        Display all header information
      --help               display this help and exit`,

  strace: `Usage: strace [OPTION]... COMMAND [ARGS]
  or:  strace [OPTION]... -p PID
Trace system calls and signals.

Options:
  -c              count time, calls, and errors for each syscall
  -e EXPR         filter expression
  -f              follow forks
  -o FILE         send trace output to FILE
  -p PID          attach to the process with the given PID
  -q              suppress messages about attaching, detaching, etc.
  -r              print relative timestamps
  -s STRSIZE      limit string length (default 32)
  -t/-tt/-ttt     print absolute timestamps
  -T              print time spent in each syscall
  -v              verbose output
  -V              print version
  -x              print non-ascii strings in hex
      --help      display this help and exit`,

  strings: `Usage: strings [OPTION]... [FILE]...
Display printable strings in the given binary file.

Options:
  -n, --bytes=NUM       Find and output any NUL-terminated sequence of at least NUM characters
  -a, --all             Scan the entire file, not just the data section
  -f, --print-file-name  Print the name of the file before each string
  -t, --radix=RADIX     Print the offset within the file before each string
  -e ENCODING           Select character encoding (s=7bit, S=8bit, b=16bit, l=16bit LSB, B=16bit MSB)
  -o                    An alias for --radix=o
  -V, --version         Print the version number
      --help            display this help and exit`,

  file: `Usage: file [OPTION]... FILE...
Determine file type of FILEs.

Options:
  -b, --brief           Do not prepend filenames to output lines
  -i, --mime            Output mime type strings
  -L, --dereference     Follow symbolic links
  -s, --special-files   Treat special (block/char) files as regular files
  -z, --uncompress      Try to look inside compressed files
  -v, --version         Print version
  -V, --verbose         Print version and configuration
      --help            display this help and exit`,

  xxd: `Usage: xxd [OPTION]... [FILE]...
Make a hex dump of a file, or vice versa.

Options:
  -b              binary digit dump
  -c, -cols N     format N octets per line (default 16)
  -E              show characters in EBCDIC
  -e              little-endian dump
  -g, -groupsize N     separate output every N bytes
  -i              output in C include file style
  -l, -len N      stop after N octets
  -o, -offset N   add N to the displayed file position
  -ps             output in postscript continuous hexdump style
  -r              reverse operation: convert hexdump into binary
  -s, -skip N     start at N bytes
  -u              use upper case hex letters
  -v              show version
      --help      display this help and exit`,

  md5sum: `Usage: md5sum [OPTION]... [FILE]...
Compute and check MD5 message digest.

Options:
  -b, --binary         read in binary mode
  -c, --check          read MD5 sums from the FILEs and check them
  -t, --text           read in text mode (default)
  -w, --warn           warn about improperly formatted checksum lines
      --help           display this help and exit`,

  sha256sum: `Usage: sha256sum [OPTION]... [FILE]...
Compute and check SHA256 message digest.

Options:
  -b, --binary         read in binary mode
  -c, --check          read SHA256 sums from the FILEs and check them
  -t, --text           read in text mode (default)
  -w, --warn           warn about improperly formatted checksum lines
      --help           display this help and exit`,

  awk: `Usage: awk [POSIX or GNU style options] -f progfile [--] file ...
Usage: awk [POSIX or GNU style options] [--] 'program' file ...
GNU Awk 5.2.1 - pattern scanning and processing language.

Options:
  -F fs, --field-separator=fs   use fs for the input field separator
  -v var=val                    assign value to variable
  -f progfile                   read awk program from file
  -i includefile                read awk include file
  -d[file]                      enable debugging of awk programs
  -D[file]                      enable debugging of awk programs
  -e                            program is data
  -g                            use POSIX-compliant regexp matching
  -V, --version                 print version
      --help                    display this help and exit`,

  sed: `Usage: sed [OPTION]... {script-only-if-no-other-script} [input-file]...
GNU sed 4.9 - stream editor for filtering and transforming text.

Options:
  -n, --quiet, --silent     suppress automatic printing of pattern space
  -e script, --expression=script  add the script to the commands to be executed
  -f script-file, --file=script-file  add the contents of script-file to the commands
  -i[SUFFIX], --in-place[=SUFFIX]   edit files in place
  -l N, --line-length=N     specify the desired line-wrap length
  -E, -r, --regexp-extended  use extended regular expressions
  -s, --separate            consider files as separate rather than as a single stream
  -u, --unbuffered          load minimal amounts of data from the input files
  -z, --null-data           separate lines by NUL characters
      --help                display this help and exit`,

  cut: `Usage: cut [OPTION]... [FILE]...
Remove sections from each line of files.

Options:
  -b, --bytes=LIST        select only these bytes
  -c, --characters=LIST   select only these characters
  -d, --delimiter=DELIM   use DELIM instead of TAB for field delimiter
  -f, --fields=LIST       select only these fields
  -n                      (ignored)
      --complement        complement the set of selected bytes, characters or fields
  -s, --only-delimited    do not print lines not containing delimiters
      --output-delimiter=STRING  use STRING as the output delimiter
      --help              display this help and exit`,

  uniq: `Usage: uniq [OPTION]... [INPUT [OUTPUT]]
Report or omit repeated lines.

Options:
  -c, --count           prefix lines by the number of occurrences
  -d, --repeated        only print duplicate lines
  -D, --all-repeated[=METHOD]  print all duplicate lines
  -i, --ignore-case     ignore case differences when comparing
  -s, --skip-chars=N    avoid comparing the first N characters
  -u, --unique          only print unique lines
  -w, --check-chars=N   compare no more than N characters in lines
      --help            display this help and exit`,

  tr: `Usage: tr [OPTION]... SET1 [SET2]
Translate, squeeze, and/or delete characters from standard input.

Options:
  -c, -C, --complement    use the complement of SET1
  -d, --delete            delete characters in SET1, do not translate
  -s, --squeeze-repeats   replace each sequence of a repeated character that is listed
                            in the last specified SET, with a single occurrence
  -t, --truncate-set1     first truncate SET1 to length of SET2
      --help              display this help and exit`,

  less: `Usage: less [OPTION]... [FILE]...
less is a terminal pager program.

Options:
  -?, --help           This help
  -e, --quit-at-eof    Exit when last page is reached
  -f, --force          Force opening non-regular files
  -g, --hilite-search  Highlight match for last search
  -i, --ignore-case    Search ignores case
  -m, --long-prompt    Prompt with percent sign
  -N, --line-numbers   Display line numbers
  -p pattern           Search for pattern
  -q, --quiet          Quiet the terminal bell
  -r, --raw-control-chars  Output raw control characters
  -s, --squeeze-blank-lines  Squeeze multiple blank lines
  -x N                 Set tab stops
      --help           display this help and exit`,

  more: `Usage: more [OPTION]... [FILE]...
more - file perusal filter for crt viewing.

Options:
  -d              display help instead of ringing bell
  -f              count logical lines rather than screen lines
  -l              suppress form feed
  -p              do not scroll, clean screen and display text
  -c              do not scroll, paint screen from top
  -s              squeeze multiple blank lines into one
  -u              suppress underlining
  -NUM            specify screen size (in lines)
      --help      display this help and exit`,

  journalctl: `Usage: journalctl [OPTIONS...]
Query the systemd journal.

Options:
  -r, --reverse          Reverse output (newest first)
  -f, --follow           Follow the journal
  -u, --unit=UNIT        Show logs for the specified systemd unit
  -b, --boot[=ID]        Show current boot or the specified boot
  -k, --dmesg            Show kernel message log
  -p, --priority=RANGE   Show messages with specified priority
  -n, --lines=NUMBER     Number of journal entries to show
  --no-pager             Do not pipe output into a pager
  -S, --since=DATE        Start showing entries on or newer than specified date
  -U, --until=DATE        Start showing entries on or older than specified date
  -o, --output=STRING    Change journal output mode
  -x, --catalog          Add explanatory text
  -e, --pager-end        Jump to the end of the journal
      --help             display this help and exit`,

  dmesg: `Usage: dmesg [OPTIONS...]
Print or control the kernel ring buffer.

Options:
  -C, --clear              Clear the ring buffer
  -c, --read-clear         Read and clear all messages
  -d, --show-delta         Show delta between messages
  -e, --reltime            Show local time and delta
  -H, --human              Human readable output
  -k, --kernel             Print kernel messages
  -l, --level=LEVEL        Print only messages of this level
  -r, --raw                Print raw message buffer
  -S, --syslog             Force use of syslog(2) rather than /dev/kmsg
  -T, --ctime              Show human-readable timestamps
  -t, --notime             Don't print timestamps
  -u, --userspace          Print userspace messages
  -w, --follow             Wait for new messages
  -x, --decode             Decode facility and level numbers
      --help               display this help and exit`,

  who: `Usage: who [OPTION]...
Show who is logged on.

Options:
  -a, --all         same as -b -d --login -p -r -t -T -u
  -b, --boot        time of last system boot
  -d, --dead        print dead processes
  -H, --heading     print line of column headings
  -l, --login       print system login processes
  -q, --count       all login names and number of users logged on
  -s, --short       only name, line and time (default)
  -t, --time        print last system clock change
  -u, --users       list users logged in
  -w, --mesg        add user's message status
      --help        display this help and exit`,

  last: `Usage: last [OPTION]... [USER]...
Show listing of last logged in users.

Options:
  -n, --lines=NUM    show at most NUM lines
  -f, --file=FILE    use FILE instead of /var/log/wtmp
  -R, --nohostname   don't show the hostname field
  -x, --system       show system shutdown entries and run level changes
  -i, --ip           display IP numbers in numbers-and-dots notation
  -w, --fullnames    display full user and domain names
  -d, --dns          translate IP numbers back to hostnames
  -p, --present      display login sessions since TIME
      --help         display this help and exit`,

  groups: `Usage: groups [USER]...
Print group memberships for each USER or current process.

      --help        display this help and exit`,

  useradd: `Usage: useradd [OPTIONS] LOGIN
Create a new user or update default new user information.

Options:
  -c, --comment COMMENT        set the GECOS field (comment)
  -d, --home-dir HOME_DIR      home directory of the new account
  -e, --expiredate EXPIRE_DATE  set account expiration date
  -g, --gid GROUP              group name or number for the new account
  -G, --groups GROUPS          list of supplementary groups
  -m, --create-home             create the user's home directory
  -M                            do not create the user's home directory
  -p, --password PASSWORD      encrypted password
  -s, --shell SHELL            login shell for the new account
  -u, --uid UID                user ID for the new account
  -U, --user-group             create a group with the same name as the user
      --help                   display this help and exit`,

  usermod: `Usage: usermod [OPTIONS] LOGIN
Modify a user account.

Options:
  -a, --append              append the user to the supplemental GROUPS
  -c, --comment COMMENT     new value of the GECOS field
  -d, --home HOME_DIR       new home directory
  -e, --expiredate EXPIRE_DATE  set account expiration date
  -g, --gid GROUP           force use GROUP as new primary group
  -G, --groups GROUPS       new list of supplementary GROUPS
  -l, --login NEW_LOGIN     new value of the login name
  -L, --lock                lock the user account
  -s, --shell SHELL         new login shell for the user account
  -u, --uid UID             new user ID for the user account
  -U, --unlock              unlock the user account
      --help                display this help and exit`,

  userdel: `Usage: userdel [OPTIONS] LOGIN
Delete a user account and related files.

Options:
  -f, --force               force removal of files
  -r, --remove              remove home directory and mail spool
  -Z, --selinux-user        remove any SELinux user mapping for the user
      --help                display this help and exit`,

  passwd: `Usage: passwd [OPTIONS] [LOGIN]
Change user password.

Options:
  -a, --all                     report password status on all accounts
  -d, --delete                  delete the password for the named account
  -e, --expire                  force expire the password for the named account
  -k, --keep-tokens             change password only if expired
  -l, --lock                    lock the password of the named account
  -S, --status                  output brief information about the status of the password
  -u, --unlock                  unlock the password of the named account
  -x, --maximum=DAYS            set maximum password lifetime
  -n, --minimum=DAYS            set minimum password lifetime
  -w, --warning=DAYS            set warning before password expires
  -i, --inactive=DAYS           set days after password expires to lock account
      --help                    display this help and exit`,

  dirb: `Usage: dirb <url> [wordlist_file(s)] [options]
DIRB - Web Content Scanner v2.22

Options:
  -a <user_agent>   Specify a custom User-Agent
  -c <cookie>       Set a cookie for the HTTP request
  -d                Delay between requests (ms)
  -f                Fine-tune detection of NOT_FOUND (404)
  -H <header>       Add a custom HTTP request header
  -i                Use case-insensitive search
  -l                Print "Location" header when found
  -N <nf_code>      Ignore responses with this HTTP code
  -o <file>         Save output to file
  -p <proxy>        Use a proxy
  -r                Don't stop on warning
  -S                Silent mode
  -t                Don't force an ending slash
  -u <username:password>  HTTP Basic/Digest Authentication
  -v                Verbose mode
  -w                Don't stop on WARNING messages
  -X <extensions>   File extensions to add to each wordlist entry
  -z <milliseconds> Delay between requests
      --help        display this help and exit`,

  wfuzz: `Usage: wfuzz [OPTIONS] URL
Wfuzz - Web fuzzer v3.1.0

Options:
  -w, --wordlist=FILE     Specify a wordlist file
  -H, --header=HEADER     Use an HTTP header
  -c, --color             Colorize output
  -d, --data=DATA         Use POST data
  -X, --method=METHOD     Specify HTTP method
  -u, --user-agent=AGENT  Set User-Agent
  -p, --proxy=PROXY       Use a proxy
  -t, --threads=NUM       Number of concurrent connections
  -s, --scan=NUM          Scan time delay
  -R, --recursive         Recursive scan
  -Z, --no-cache          Disable cache
  -v, --verbose           Verbose output
      --help              display this help and exit`,

  whatweb: `Usage: whatweb [OPTIONS] [URLS]
WhatWeb - Next generation web scanner v0.9.0

Options:
  -a, --aggression LEVEL    Aggression level (1-4, default 1)
  -v, --verbose             Verbose output
  -l, --list-plugins        List all plugins
  -i, --input-file FILE     Input file with URLs
  -u, --user-agent AGENT    Custom user agent
  -p, --proxy PROXY         Set proxy
  -c, --cookie COOKIE       Set cookie
  -H, --header HEADER       Add custom header
  -t, --threads NUM         Number of threads
  -q, --quiet               Quiet mode
  -s, --short               Short format
  -S, --summary             Summary format
  -1, --one                 1 request per target
      --help                display this help and exit`,

  wpscan: `Usage: wpscan [OPTIONS] URL
WPScan - WordPress Security Scanner v3.8.25

Options:
  --url URL                 The URL of the blog to scan
  -e, --enumerate [OPTS]    Enumeration options (u=users, p=plugins, t=themes, v=versions)
  --plugins-detection MODE  Plugin detection mode (mixed, passive, aggressive, default mixed)
  -U, --usernames LIST      List of usernames to use
  -P, --passwords LIST      List of passwords to use
  --password-attempts NUM   Number of password attempts to try (default 5)
  --ttl NUM                 Request TTL
  --api-token TOKEN         WPVulnDB API token
  --headers HEADERS         Additional HTTP headers
  -v, --verbose             Verbose mode
  --disable-tls-checks      Disable TLS checks
  -f, --force               Force scan even if target returns 404
  -o, --output FILE         Output results to file
      --help                display this help and exit`,

  medusa: `Usage: medusa [OPTIONS] [HOST]
Medusa - brute-force login credentials v2.2

Options:
  -h, --host HOST            Target hostname or IP
  -u, --user USERNAME        Username to test
  -U, --user-file FILE       File containing usernames
  -p, --password PASSWORD    Password to test
  -P, --password-file FILE   File containing passwords
  -M, --module MODULE        Module to use (ssh, ftp, http, smbnt, mssql, mysql, telnet, etc.)
  -m, --module-option OPT    Pass option to module
  -t, --threads NUM          Number of threads
  -O, --output FILE          Output file
  -e, --set [n/s/ns]         Additional checks (n=null, s=user as password)
  -n, --port NUM             Port to use
  -g, --group NUM            Group size
  -d, --disable              Disable host
  -q, --quiet                Quiet mode
  -v, --verbose              Verbose mode
      --help                 display this help and exit`,

  ncrack: `Usage: ncrack [OPTIONS] [TARGET]
Ncrack - network authentication cracking tool v0.7

Options:
  -i, --input FILE           input file for targets
  -u, --user USER            username
  -U, --user-file FILE       file of usernames
  -p, --pass PASSWORD        password
  -P, --password-file FILE   file of passwords
  -F, --ftp                  FTP authentication cracking
  -S, --ssh                  SSH authentication cracking
  -H, --http                 HTTP authentication cracking
  -T, --telnet               TELNET authentication cracking
  -v, --verbose              verbose mode
  -d, --delay SECS           delay between attempts
  -t, --threads NUM          number of parallel connections
  -o, --output FILE          output results to file
      --help                 display this help and exit`,

  cewl: `Usage: cewl [OPTIONS] URL
CeWL - Custom Word List Generator v6.1

Options:
  -d, --depth NUM            Depth to spider to (default 2)
  -m, --min-word-length NUM  Minimum word length (default 3)
  -x, --max-word-length NUM  Maximum word length (default 30)
  -w, --write FILE           Write output to file
  -o, --output FILE          Write output to file
  -c, --count                Count of words
  -u, --user-agent AGENT     User agent to use
  -n, --no-words             No words output
  -a, --auth USER:PASS       Authentication
  -h, --help                 Help
      --help                 display this help and exit`,

  lsof: `Usage: lsof [OPTION]... [FILE]...
List open files.

Options:
  -i [i]             list IP sockets
  -u user            list files open by user
  -p PID             list files open by process
  -c cmd             list files for processes starting with cmd
  -t                 terse output (PID only)
  -n                 no host names (for -i)
  -P                 no port names (for -i)
  -d FD              list files with file descriptor FD
  +D DIR             list files in DIR and subdirectories
  -a                 AND conditions (default is OR)
      --help         display this help and exit`,

  crontab: `Usage: crontab [OPTION]...
Maintain crontab files for individual users.

Options:
  -u user             user
  -l                  display current crontab
  -e                  edit current crontab (with nano)
  -r                  delete current crontab
  -i                  prompt before deleting
      --help          display this help and exit`,

  service: `Usage: service <service> <command>
Run a System V init script.

Commands:
  start              start the service
  stop               stop the service
  restart            restart the service
  reload             reload configuration
  status             show status of the service`,

  systemctl: `Usage: systemctl [OPTIONS] COMMAND [UNIT]
Control the systemd system and service manager.

Commands:
  start UNIT           Start (activate) one or more units
  stop UNIT            Stop (deactivate) one or more units
  reload UNIT          Reload one or more units
  restart UNIT         Start or stop and then start one or more units
  status [UNIT]        Show runtime status of one or more units
  enable UNIT          Enable one or more unit files
  disable UNIT         Disable one or more unit files
  is-enabled UNIT      Check whether unit files are enabled
  list-units           List units currently loaded into memory
  daemon-reload        Reload systemd manager configuration

Options:
  --user              Talk to the user service manager
  -H, --host=HOST     Operate on remote host
  -M, --machine=CONTAINER  Operate on local container
  -p, --property=NAME  Limit output to properties with specific value
  -q, --quiet         Suppress output
  -t, --type=TYPE     Limit results to units of type
      --help          display this help and exit`,

  chown: `Usage: chown [OPTION]... [OWNER][:[GROUP]] FILE...
Change file owner and group.

Options:
  -R, --recursive        operate on files and directories recursively
  -v, --verbose          output a diagnostic for every file processed
  -c, --changes          like verbose but report only when a change is made
  -f, --silent           suppress most error messages
      --help             display this help and exit`,

  umask: `Usage: umask [-p] [-S] [mode]
Display or set the file mode creation mask.

Options:
  -p              output in a form that may be used as input
  -S              symbolic output format
      --help      display this help and exit`,

  jobs: `Usage: jobs [-lnprs] [jobspec ...]
Display status of jobs.

Options:
  -l              display process group IDs and working directories
  -n              display only jobs that have changed status
  -p              display only process IDs
  -r              display only running jobs
  -s              display only stopped jobs`,

  bg: `bg: bg [job_spec ...]
Place each jobspec in the background, as if they had been started with &.

      --help     display this help and exit`,

  fg: `fg: fg [job_spec ...]
Place each jobspec in the foreground.

      --help     display this help and exit`,

  alias: `Usage: alias [-p] [name[=value] ...]
Define or display aliases.

Options:
  -p              print all defined aliases in a reusable format
      --help      display this help and exit`,

  export: `Usage: export [-fn] [name[=value] ...]
Set export attribute for shell variables.

Options:
  -f              refer to shell functions
  -n              remove the export property from each name
  -p              display a list of all exported variables
      --help      display this help and exit`,

  history: `Usage: history [-c] [-d offset] [n]
Display or manipulate the command history.

Options:
  -c              clear the history list
  -d offset       delete the history entry at position offset
  -a              append history lines from this session to history file
  -r              read the history file and append its contents to history
  -w              write the current history to the history file
  -n              read all history lines not already read from history file
  -p              perform history expansion on each ARG
  -s              append the ARGs to the history list as a single entry`,

  help: `QYVORA Simulated Terminal - Help
====================================

  NAVIGATION
    ls [path]              List directory contents
    cd [dir]               Change directory
    pwd                    Print current working directory
    tree [path]            Display directory tree

  FILE OPERATIONS
    cat <file>             Display file contents
    echo <text>            Print text
    touch <file>           Create empty file
    mkdir <dir>            Create directory
    rm [-rf] <path>        Remove files/directories
    cp <src> <dst>         Copy files
    mv <src> <dst>         Move/rename files
    chmod <mode> <file>    Change file permissions
    head [-n] <file>       Show first lines of file
    tail [-n] <file>       Show last lines of file
    wc <file>              Count lines, words, chars
    grep <pattern> <file>  Search file contents
    find <path> -name <p>  Find files
    sort <file>            Sort file contents
    less <file>            View file contents (paged)
    diff <f1> <f2>         Compare files
    ln -s <src> <dest>     Create symbolic link
    du [-h] <path>         Estimate file space usage
    df                     Disk free
    tar -c/x/t -f <a>      Archive utility
    zip <a> <files>        Compress files
    unzip <file>           Extract zip archive
    xxd <file>             Hex dump
    strings <file>         Extract printable strings
    file <file>            Determine file type
    md5sum/sha256sum       Compute file hashes
    awk '{print}' <file>   Text processing
    sed 's/old/new/'       Stream editor
    cut -f N -d D <file>   Column extraction
    uniq <file>            Remove duplicates
    tr <set1> <set2>       Translate characters

  SYSTEM INFO
    whoami                 Show current user
    id                     Show user identity
    uname [-a]             Show system info
    date                   Show date/time
    cal [month] [year]     Show calendar
    uptime                 Show system uptime
    hostname               Show system hostname
    env                    Show environment variables
    ps [aux]               List processes
    top                    Show process overview
    kill [-9] <pid>        Kill process
    sudo <cmd>             Execute as root
    free                   Memory usage
    lsof                   List open files
    crontab -l             List cron jobs
    service <name> <act>   Service management
    systemctl <cmd> <srv>  Systemd control
    chown <user> <file>    Change file owner
    umask                  File mode mask
    jobs                   List background jobs
    bg                     Resume job in background
    fg                     Resume job in foreground

  NETWORK
    ping [-c n] <host>     Ping a host
    curl <url>             HTTP request
    nmap [-sV] <target>    Port scanner
    netstat [-tuln]        Network connections
    ss [-tuln]             Socket statistics
    dig <domain>           DNS lookup
    whois <domain>         WHOIS lookup
    traceroute <host>      Trace route to host
    arp                    ARP table
    ip route               Routing table
    wget <url>             Download file
    scp <src> <dest>       Secure copy
    ssh [user@]host        SSH connection

  SECURITY TOOLS
    gobuster -u <url> -w <wordlist>   Directory brute-force
    hydra -l <user> -P <wordlist> <service>://<target>
                                      Password brute-force
    sqlmap -u <url>                    SQL injection scanner
    nikto -h <host>                    Web server scanner
    john <hashfile>                    Password cracker
    searchsploit <term>                Exploit search
    enum4linux <host>                  Windows/Samba enumeration
    smbclient -L <host>                SMB client
    crackmapexec <target>              Network exploitation tool
    hashcat -m <mode> <hashfile>       Hash cracking
    exiftool <file>                    Metadata viewer
    binwalk <file>                     Firmware analysis
    msfconsole                         Metasploit Framework

  DEVELOPMENT
    python3 <script>       Python interpreter
    node <script>          Node.js runtime
    git <command>          Git version control
    pip <command>          Python package manager
    apt <command>          Package manager
    npm <command>          Node package manager
    docker <command>       Container management
    tmux/screen <cmd>      Terminal multiplexer
    make                   Build tool
    gcc <file>             C compiler

  META
    clear                  Clear terminal
    help                   Show this help
    history [-c]           Show/clear command history
    alias [name=value]     Manage aliases
    export [VAR=value]     Set environment variable
    reset                  Reset terminal
    exit                   Close terminal

  QYVORA SPECIFIC
    qyvora-help            Show course-related commands

  KEYBOARD SHORTCUTS
    Ctrl+A/E               Jump to start/end of line
    Ctrl+U/K               Delete to start/end of line
    Ctrl+W                 Delete word before cursor
    Ctrl+L                 Clear screen
    Ctrl+C                 Cancel current input
    Ctrl+D                 Exit (on empty line)
    Ctrl+R                 Reverse-search history
    Tab                    Auto-complete files/paths
    Tab+Tab                Show all completions
    !!                     Repeat last command
    !n                     Repeat history entry n`,

  reset: `reset: reset
Reset the terminal.

      --help     display this help and exit`,

  clear: `clear: clear
Clear the terminal screen.

      --help     display this help and exit`,
};
