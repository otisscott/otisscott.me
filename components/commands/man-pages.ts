/**
 * Man Pages
 * Static man page content for all terminal commands.
 * Separated from handlers.ts for readability.
 */

import { ANSI } from '@/lib/filesystem/types';

export const manPages: Record<string, string> = {
  help: `${ANSI.bold}NAME${ANSI.reset}
    help - display available commands

${ANSI.bold}SYNOPSIS${ANSI.reset}
    help

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show a list of all available terminal commands with brief descriptions.

${ANSI.bold}EXAMPLES${ANSI.reset}
    help`,
  ls: `${ANSI.bold}NAME${ANSI.reset}
    ls - list directory contents

${ANSI.bold}SYNOPSIS${ANSI.reset}
    ls [-la] [path]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    List files and directories. Supports -a (show hidden), -l (long format),
    and --tree (tree view).

${ANSI.bold}EXAMPLES${ANSI.reset}
    ls
    ls -la work/`,
  cd: `${ANSI.bold}NAME${ANSI.reset}
    cd - change directory

${ANSI.bold}SYNOPSIS${ANSI.reset}
    cd [path]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Change the current working directory. Supports ~, .., and absolute paths.

${ANSI.bold}EXAMPLES${ANSI.reset}
    cd projects
    cd ~`,
  pwd: `${ANSI.bold}NAME${ANSI.reset}
    pwd - print working directory

${ANSI.bold}SYNOPSIS${ANSI.reset}
    pwd

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Print the full path of the current working directory.`,
  cat: `${ANSI.bold}NAME${ANSI.reset}
    cat - display file contents

${ANSI.bold}SYNOPSIS${ANSI.reset}
    cat <file>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display the contents of a file. Renders markdown and JSON with formatting.

${ANSI.bold}EXAMPLES${ANSI.reset}
    cat about/bio.md
    cat work/skills.json`,
  tree: `${ANSI.bold}NAME${ANSI.reset}
    tree - display directory tree

${ANSI.bold}SYNOPSIS${ANSI.reset}
    tree [path]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show the directory structure as an indented tree.

${ANSI.bold}EXAMPLES${ANSI.reset}
    tree
    tree projects/`,
  grep: `${ANSI.bold}NAME${ANSI.reset}
    grep - search file contents

${ANSI.bold}SYNOPSIS${ANSI.reset}
    grep <pattern> [path]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Search for a pattern in files. Case-insensitive. Highlights matches.

${ANSI.bold}EXAMPLES${ANSI.reset}
    grep typescript
    grep react projects/`,
  open: `${ANSI.bold}NAME${ANSI.reset}
    open - open URL from file

${ANSI.bold}SYNOPSIS${ANSI.reset}
    open <file|url>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Open a URL in a new tab. Can extract URLs from files or open directly.

${ANSI.bold}EXAMPLES${ANSI.reset}
    open contact/social.json
    open https://github.com`,
  whoami: `${ANSI.bold}NAME${ANSI.reset}
    whoami - display user information

${ANSI.bold}SYNOPSIS${ANSI.reset}
    whoami

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display the current user's identity and role.`,
  skills: `${ANSI.bold}NAME${ANSI.reset}
    skills - display technical skills

${ANSI.bold}SYNOPSIS${ANSI.reset}
    skills

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show technical skills organized by category with proficiency levels.`,
  experience: `${ANSI.bold}NAME${ANSI.reset}
    experience - list work history

${ANSI.bold}SYNOPSIS${ANSI.reset}
    experience

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display work experience timeline with companies and roles.`,
  contact: `${ANSI.bold}NAME${ANSI.reset}
    contact - display contact information

${ANSI.bold}SYNOPSIS${ANSI.reset}
    contact

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show email and social media links.`,
  projects: `${ANSI.bold}NAME${ANSI.reset}
    projects - list all projects

${ANSI.bold}SYNOPSIS${ANSI.reset}
    projects

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display portfolio projects with descriptions.`,
  echo: `${ANSI.bold}NAME${ANSI.reset}
    echo - print text to terminal

${ANSI.bold}SYNOPSIS${ANSI.reset}
    echo [text...]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Print arguments to the terminal output.

${ANSI.bold}EXAMPLES${ANSI.reset}
    echo hello world`,
  date: `${ANSI.bold}NAME${ANSI.reset}
    date - show current date and time

${ANSI.bold}SYNOPSIS${ANSI.reset}
    date

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display the current date and time from the browser.`,
  history: `${ANSI.bold}NAME${ANSI.reset}
    history - show command history

${ANSI.bold}SYNOPSIS${ANSI.reset}
    history
    history | grep <pattern>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display previously entered commands. Supports piping to grep.

${ANSI.bold}EXAMPLES${ANSI.reset}
    history
    history | grep cat`,
  ping: `${ANSI.bold}NAME${ANSI.reset}
    ping - ping a host

${ANSI.bold}SYNOPSIS${ANSI.reset}
    ping [host]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Send simulated ICMP echo requests. Defaults to otisscott.me.

${ANSI.bold}EXAMPLES${ANSI.reset}
    ping
    ping google.com`,
  theme: `${ANSI.bold}NAME${ANSI.reset}
    theme - change color theme

${ANSI.bold}SYNOPSIS${ANSI.reset}
    theme [name]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Switch the terminal color theme. Run without args to see available themes.

${ANSI.bold}EXAMPLES${ANSI.reset}
    theme
    theme dracula`,
  neofetch: `${ANSI.bold}NAME${ANSI.reset}
    neofetch - display system info

${ANSI.bold}SYNOPSIS${ANSI.reset}
    neofetch

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show system information in a pretty box with ASCII art.`,
  cowsay: `${ANSI.bold}NAME${ANSI.reset}
    cowsay - ASCII cow says a message

${ANSI.bold}SYNOPSIS${ANSI.reset}
    cowsay [message]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display an ASCII cow saying your message. Defaults to "Moo!".

${ANSI.bold}EXAMPLES${ANSI.reset}
    cowsay hello
    cowsay hire me`,
  git: `${ANSI.bold}NAME${ANSI.reset}
    git - version control

${ANSI.bold}SYNOPSIS${ANSI.reset}
    git <command>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Simulated git commands. Supports status, log, branch, remote.

${ANSI.bold}EXAMPLES${ANSI.reset}
    git status
    git log`,
  gs: `${ANSI.bold}NAME${ANSI.reset}
    gs - git status shortcut

${ANSI.bold}SYNOPSIS${ANSI.reset}
    gs

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Alias for 'git status'. Shows working tree status.`,
  gl: `${ANSI.bold}NAME${ANSI.reset}
    gl - git log shortcut

${ANSI.bold}SYNOPSIS${ANSI.reset}
    gl

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Alias for 'git log'. Shows recent commits.`,
  sudo: `${ANSI.bold}NAME${ANSI.reset}
    sudo - execute as superuser

${ANSI.bold}SYNOPSIS${ANSI.reset}
    sudo <command>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Nice try. You are not in the sudoers file.`,
  vim: `${ANSI.bold}NAME${ANSI.reset}
    vim - Vi IMproved

${ANSI.bold}SYNOPSIS${ANSI.reset}
    vim

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Enter vim. Good luck getting out. Type :q to exit. Maybe.`,
  sl: `${ANSI.bold}NAME${ANSI.reset}
    sl - steam locomotive

${ANSI.bold}SYNOPSIS${ANSI.reset}
    sl

${ANSI.bold}DESCRIPTION${ANSI.reset}
    You misspelled 'ls'. Enjoy the train.`,
  rm: `${ANSI.bold}NAME${ANSI.reset}
    rm - remove files

${ANSI.bold}SYNOPSIS${ANSI.reset}
    rm [-rf] <path>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Try 'rm -rf /' for a fun time. (Don't worry, nothing actually gets deleted.)`,
  docker: `${ANSI.bold}NAME${ANSI.reset}
    docker - container management

${ANSI.bold}SYNOPSIS${ANSI.reset}
    docker <command>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Simulated Docker CLI. Supports ps, images, run, compose.

${ANSI.bold}EXAMPLES${ANSI.reset}
    docker ps
    docker compose up`,
  ssh: `${ANSI.bold}NAME${ANSI.reset}
    ssh - secure shell

${ANSI.bold}SYNOPSIS${ANSI.reset}
    ssh [user@host]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Connect to a remote host. Spoiler: you're already here.`,
  htop: `${ANSI.bold}NAME${ANSI.reset}
    htop - interactive process viewer

${ANSI.bold}SYNOPSIS${ANSI.reset}
    htop

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Full-screen process monitor with live CPU/memory stats. Press q to exit.`,
  uptime: `${ANSI.bold}NAME${ANSI.reset}
    uptime - show system uptime

${ANSI.bold}SYNOPSIS${ANSI.reset}
    uptime

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show how long you've been browsing this site.`,
  make: `${ANSI.bold}NAME${ANSI.reset}
    make - build automation

${ANSI.bold}SYNOPSIS${ANSI.reset}
    make

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Run the build system. Compiles the portfolio from source.`,
  clear: `${ANSI.bold}NAME${ANSI.reset}
    clear - clear terminal screen

${ANSI.bold}SYNOPSIS${ANSI.reset}
    clear

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Clear the terminal scrollback and reset the display.`,
  exit: `${ANSI.bold}NAME${ANSI.reset}
    exit - exit the terminal

${ANSI.bold}SYNOPSIS${ANSI.reset}
    exit

${ANSI.bold}DESCRIPTION${ANSI.reset}
    There is no escape. You live here now.`,
  todo: `${ANSI.bold}NAME${ANSI.reset}
    todo - personal todo list

${ANSI.bold}SYNOPSIS${ANSI.reset}
    todo [list|add|done|rm|clear]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Manage a personal todo list persisted to localStorage.

${ANSI.bold}EXAMPLES${ANSI.reset}
    todo
    todo add Buy more coffee
    todo done 1
    todo rm 2
    todo clear`,
  cal: `${ANSI.bold}NAME${ANSI.reset}
    cal - display a calendar

${ANSI.bold}SYNOPSIS${ANSI.reset}
    cal

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Show the current month's calendar with today highlighted.`,
  scp: `${ANSI.bold}NAME${ANSI.reset}
    scp - secure copy

${ANSI.bold}SYNOPSIS${ANSI.reset}
    scp [user@]host:file dest

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Copy files over SSH. Shows a transfer animation.

${ANSI.bold}EXAMPLES${ANSI.reset}
    scp otis@otisscott.me:resume.pdf .`,
  alias: `${ANSI.bold}NAME${ANSI.reset}
    alias - define command aliases

${ANSI.bold}SYNOPSIS${ANSI.reset}
    alias [name='command']

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Define or list command aliases. Persisted to localStorage.

${ANSI.bold}EXAMPLES${ANSI.reset}
    alias
    alias ll='ls -la'`,
  unalias: `${ANSI.bold}NAME${ANSI.reset}
    unalias - remove an alias

${ANSI.bold}SYNOPSIS${ANSI.reset}
    unalias <name>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Remove a previously defined command alias.

${ANSI.bold}EXAMPLES${ANSI.reset}
    unalias ll`,
  jobs: `${ANSI.bold}NAME${ANSI.reset}
    jobs - list background jobs

${ANSI.bold}SYNOPSIS${ANSI.reset}
    jobs

${ANSI.bold}DESCRIPTION${ANSI.reset}
    List running and completed background jobs. Start a job with '&'.

${ANSI.bold}EXAMPLES${ANSI.reset}
    make &
    jobs`,
  fg: `${ANSI.bold}NAME${ANSI.reset}
    fg - bring job to foreground

${ANSI.bold}SYNOPSIS${ANSI.reset}
    fg [job_id]

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Bring a background job to the foreground.`,
  bg: `${ANSI.bold}NAME${ANSI.reset}
    bg - resume job in background

${ANSI.bold}SYNOPSIS${ANSI.reset}
    bg

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Resume a stopped job in the background. (No stopped jobs here.)`,
  man: `${ANSI.bold}NAME${ANSI.reset}
    man - display manual pages

${ANSI.bold}SYNOPSIS${ANSI.reset}
    man <command>

${ANSI.bold}DESCRIPTION${ANSI.reset}
    Display the manual page for a command. You're reading one right now.
    Very meta.

${ANSI.bold}EXAMPLES${ANSI.reset}
    man ls
    man cowsay`,
};
