/**
 * Filesystem Data
 * Virtual filesystem content for the terminal
 */

import { DirectoryNode, FileNode } from './types';
import { gitCommits } from './git-log-data';

function createFile(
  name: string,
  content: string,
  options: Partial<Omit<FileNode, 'type' | 'name' | 'content'>> = {}
): FileNode {
  return {
    type: 'file',
    name,
    content,
    permissions: options.permissions ?? '-rw-r--r--',
    owner: options.owner ?? 'otis',
    group: options.group ?? 'staff',
    size: options.size ?? content.length,
    modified: options.modified ?? new Date('2026-02-01'),
  };
}

function createDirectory(
  name: string,
  children: (FileNode | DirectoryNode)[] = [],
  options: Partial<Omit<DirectoryNode, 'type' | 'name' | 'children'>> = {}
): DirectoryNode {
  const childrenMap = new Map<string, FileNode | DirectoryNode>();
  children.forEach(child => {
    childrenMap.set(child.name, child);
  });

  return {
    type: 'directory',
    name,
    children: childrenMap,
    permissions: options.permissions ?? 'drwxr-xr-x',
    owner: options.owner ?? 'otis',
    group: options.group ?? 'staff',
    modified: options.modified ?? new Date('2026-02-01'),
  };
}

// Create the filesystem structure
export const rootDirectory = createDirectory('', [
  createDirectory('about', [
    createFile('whoami.txt', `╔════════════════════════════════════════════════════════════════╗
║  Otis Scott                                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Director of Technology @ Manhattan Wine Company               ║
║  Co-Founder & Engineer @ DataEarn                              ║
║                                                                ║
║  NYU CS '22 · Building at the intersection of wine & tech.     ║
║  Turning a 20-year-old wine business into a software company.  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝`),
    createFile('bio.md', `# About Me

I'm **Otis Scott** — a software engineer building technology for the wine industry.

## Background

I studied Computer Science at **NYU** (BS '22) and have been writing code since high school. After college I co-founded **DataEarn**, a data monetization platform, and spent time in sales roles at FiscalNote and Aer Compliance before joining the family business.

## What I Do Now

I'm the **Director of Technology** at **Manhattan Wine Company**, a 20-year-old fine wine storage and logistics company in NYC. I'm building **Vault OS** under **The American Storage Company** (my LLC) — a full-stack SaaS platform to modernize how the company manages wine inventory, client accounts, and warehouse operations.

I also build **Shopify apps** for wine merchants — tools for LWIN-based inventory mapping, appraisals, and catalog management.

## Philosophy

- **Build for the domain** — The best software comes from deeply understanding the business
- **Ship and iterate** — Working software over perfect plans
- **Automate the tedious** — Let people focus on what matters
`),
    createFile('interests.txt', `Things I'm Into:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Traveling & backpacking
• Boating & fishing
• Cooking
• Woodworking
• Audio equipment
• Wine industry technology
• AI/ML and developer tooling
• Neovim & terminal workflows
• Quality time with my girlfriend Clementine and cat Momo`),
  ]),
  createDirectory('work', [
    createDirectory('experience', [
      // Inserted oldest-first; experienceCommand() calls .reverse() for newest-first display
      createFile('intern-ironwood.md', `# Research Intern
## Ironwood Capital Management

📅 July 2019 - August 2019

Summer research internship at a San Francisco-based investment firm.

### Responsibilities
- Conducted market research and financial analysis
- Supported investment decision-making with data-driven insights

### Location
San Francisco, CA`),
      createFile('cofounded-dataearn.md', `# Co-Founder & Founding Engineer
## DataEarn

📅 June 2020 - Present

Co-founded a data monetization platform. Built the full stack from scratch — backend API, frontend app, and cloud infrastructure.

### What I Built
- Backend API with Django and Django REST Framework
- Frontend application with Next.js and React
- Cloud infrastructure on Azure (VMs, storage, networking)
- User authentication, data pipelines, and admin tooling

### Technologies
Python, Django, DRF, Next.js, React, Azure, PostgreSQL`),
      createFile('sdr-fiscalnote.md', `# Sales Development Representative
## FiscalNote

📅 January 2023 - January 2024

Outbound sales development for a regulatory data and analytics platform serving government affairs teams.

### Location
New York, NY`),
      createFile('bdr-aer.md', `# Business Development Representative
## Aer Compliance

📅 January 2024 - October 2024

Business development for an environmental compliance software company.

### Location
New York, NY`),
      createFile('sales-infrastructure.md', `# Sales & Infrastructure
## Manhattan Wine Company

📅 October 2024 - September 2025

Joined the family wine business to modernize operations. Started by handling sales while scoping the technology needs of a 20-year-old company.

### What I Did
- Managed client relationships and wine sales operations
- Audited existing systems and identified automation opportunities
- Began prototyping Vault OS for inventory and warehouse management
- Earned WSET Level 2 certification

### Technologies
Python, Django, PostgreSQL, Shopify`),
      createFile('director-of-tech.md', `# Director of Technology
## Manhattan Wine Company

📅 September 2025 - Present

Leading technology strategy and building Vault OS — a full-stack platform to run the wine storage, logistics, and sales operations.

### What I'm Building
- Vault OS: inventory management, client portals, warehouse operations
- Shopify apps for wine merchants (LWIN mapping, appraisals)
- Data integrations with third-party wine databases
- Internal tooling for warehouse staff and sales team

### Technologies
Python, Django, React, TypeScript, PostgreSQL, Redis, Docker, Shopify, Prisma`),
    ]),
    createFile('skills.json', JSON.stringify({
      languages: {
        icon: "💻",
        items: [
          { name: "Python", level: "expert", years: 6 },
          { name: "TypeScript", level: "expert", years: 4 },
          { name: "JavaScript", level: "expert", years: 6 },
          { name: "SQL", level: "expert", years: 5 }
        ]
      },
      frontend: {
        icon: "🎨",
        items: [
          { name: "React", level: "expert", years: 4 },
          { name: "Next.js", level: "proficient", years: 3 },
          { name: "Remix/React Router", level: "proficient", years: 2 },
          { name: "Tailwind CSS", level: "proficient", years: 3 },
          { name: "HTML/CSS", level: "expert", years: 6 }
        ]
      },
      backend: {
        icon: "⚙️",
        items: [
          { name: "Django/DRF", level: "expert", years: 5 },
          { name: "Node.js", level: "proficient", years: 4 },
          { name: "PostgreSQL", level: "expert", years: 5 },
          { name: "Redis", level: "proficient", years: 3 },
          { name: "Prisma", level: "proficient", years: 2 }
        ]
      },
      platforms: {
        icon: "🚀",
        items: [
          { name: "Shopify App Dev", level: "proficient", years: 2 },
          { name: "Azure", level: "proficient", years: 3 },
          { name: "Docker", level: "proficient", years: 4 },
          { name: "Sentry", level: "proficient", years: 2 },
          { name: "Linux", level: "proficient", years: 5 }
        ]
      },
      tools: {
        icon: "🛠️",
        items: [
          { name: "Git", level: "expert", years: 6 },
          { name: "Neovim", level: "expert", years: 3 },
          { name: "Claude Code", level: "proficient", years: 1 },
          { name: "Zsh", level: "proficient", years: 4 }
        ]
      }
    }, null, 2)),
  ]),
  createDirectory('education', [
    createFile('nyu.md', `# New York University
## Bachelor of Science — Computer Science

📅 2018 - 2022

Courant Institute of Mathematical Sciences, NYU.`),
    createFile('wset.md', `# Wine & Spirit Education Trust
## Level 2 Award in Wines

📅 October 2024 - December 2024

Systematic approach to wine tasting, grape varieties, and regions.`),
  ]),
  createDirectory('contact', [
    createFile('email.txt', `📧 Email Contact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

otismscott@gmail.com

For inquiries about:
  • Technology consulting & collaboration
  • Wine industry software
  • Open source projects
  • Just saying hi`),
    createFile('social.json', JSON.stringify({
      github: {
        url: "github.com/otisscott",
        handle: "@otisscott",
        description: "Code, dotfiles, and open source projects"
      },
      linkedin: {
        url: "linkedin.com/in/otis-scott",
        handle: "Otis Scott",
        description: "Professional background & career updates"
      }
    }, null, 2)),
  ]),
  createDirectory('projects', [
    createFile('vault-os.md', `# Vault OS

Multi-tenant SaaS platform for fine asset storage and logistics — replacing a $90k/year legacy WMS.

## What It Does
- Immutable provenance tracking (every state change creates an audit event)
- Dual-platform: internal WMS for warehouse ops + client portal for customers
- Inventory management, inbound/outbound workflows, cycle counts
- Multi-factor auth (TOTP, SMS, FIDO2 WebAuthn)
- Custom domain mapping per tenant

## Tech Stack
- Django 6.0 + Django Ninja (API) — Python 3.14
- React 19 + TypeScript 5.9 + Vite 7 (Bun monorepo)
- PostgreSQL 18 + pgvector (semantic search) + Redis 7
- Celery + RabbitMQ (async processing)
- Tailwind 4 + Radix UI + TanStack Query/Table
- Docker + OpenTofu (IaC on DigitalOcean)
- 1Password CLI for zero-secrets-on-disk development
- Sentry, GitHub Actions CI/CD

🔗 https://theamericanstoragecompany.com`),
    createFile('dataearn.md', `# DataEarn

Data privacy and monetization platform — co-founded in 2020. Users upload data exports from major tech companies and get interactive dashboards showing exactly what was collected.

## What It Does
- Parses data exports from 10+ platforms (Facebook, Instagram, Uber, Spotify, TikTok, etc.)
- Generates interactive "DataCards" — visualizations of your data footprint
- 10,000+ lines of platform-specific parsing logic across JSON, CSV, and HTML formats
- GDPR-compliant data deletion and privacy controls
- Stripe-integrated payment system

## Notable
- Participated in NYU Startup Sprint (Summer 2022)
- 5,248-line Instagram parser handling 40+ data file types

## Tech Stack
- Django 4.1 + DRF with JWT auth (backend)
- Next.js 12 + TypeScript + Chakra UI + Chart.js (frontend)
- PostgreSQL + Azure Blob Storage + Azure App Service
- Stripe payments, SendGrid emails, APScheduler cron
- Azure Pipelines CI/CD + Application Insights monitoring

🔗 https://dataearn.com`),
    createFile('lwin-mapping.md', `# LWIN Mapping

Production Shopify embedded app for fine wine merchants. Automates inventory management by integrating the Liv-ex wine identification database.

## What It Does
- Bulk appraisal workflows — upload collections via Excel, auto-price with market data
- Client collaboration portal with password-protected sharing and comments
- Bulk product creation with 20+ wine-specific attributes from LWIN7 lookup
- Real-time progress tracking via Server-Sent Events (SSE)
- Shopify Admin extension for in-context "Create with LWIN" button
- Allocation comparison tool — visual diffs across spreadsheets

## Tech Stack
- React Router 7 + TypeScript (full-stack)
- PostgreSQL + Prisma (data layer)
- Shopify App Bridge + Polaris + Admin GraphQL API
- Liv-ex LWIN API (OAuth 2.0)
- ExcelJS + PDFKit (file processing and reports)
- Sentry (error tracking + session replay)
- Vercel (deployment)

🔒 Shopify App Store — in development`),
    createFile('sec-scraper.md', `# SEC Form ADV Scraper

Competitive intelligence tool that mines SEC investment adviser filings to identify vendor adoption across 70k+ registered firms.

## What It Does
- Parses SEC's 73MB IA/BD DataDump XML (all registered investment advisers)
- Downloads and extracts text from individual Form ADV PDF brochures
- Identifies competitor software usage (ComplianceSci, Orion, ACA, etc.)
- Smart resume logic — restarts from last processed firm on interruption
- Filters by employee count, valid website, and target vendor mentions

## How It Works
Scheduled XML pull from SEC EDGAR → filter firms → Selenium downloads PDFs
→ pypdf extraction → regex matching on "books and records" section → CSV

Originally ran automated scheduled pulls to keep the dataset current,
until SEC rate limiting started causing IP bans.

## Tech Stack
- Python + pandas
- pypdf + BeautifulSoup (PDF/HTML parsing)
- Selenium + pyvirtualdisplay (headless browser for SEC pages)

🔗 github.com/otisscott/sec_scraping`),
    createFile('terminal-portfolio.md', `# Terminal Portfolio

**This website!**

A terminal-inspired portfolio built with Next.js and xterm.js.

## Features
- Full terminal emulation with xterm.js
- Virtual filesystem with navigation
- Syntax highlighting for code files
- Tokyo Night color theme
- Easter eggs (try \`neofetch\` or \`cowsay\`!)

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- xterm.js

🔗 github.com/otisscott/otisscott.me`),
    createFile('dotfiles.md', `# Dotfiles

800+ config files across Neovim, Zsh, Claude Code, and system tools.

## Includes
- Neovim — Lua config with LSP, Treesitter, lazy.nvim, Tokyo Night
- Zsh — Oh My Zsh + Pure theme, 187 aliases, zoxide, atuin history
- Claude Code — 48 specialized agents, 141 custom skills, 17 behavior rules
- Git, Ghostty, AeroSpace (tiling WM), and tool configs

## Highlights
- Claude Code agent orchestration framework (Oracle, Scout, Phoenix, Maestro, etc.)
- Event-driven hooks for context injection, memory awareness, and session continuity
- Knowledge management system with semantic search and crystallization
- Cross-platform install scripts (macOS/Linux/WSL)

🔗 github.com/otisscott/dotfiles`),
  ]),
  createDirectory('blog', [
    createDirectory('2025', [
      createFile('why-terminal-uis.md', `# Why I Built a Terminal UI for My Portfolio

*Published: January 2025*

The web has become heavy. Every portfolio site is a React app with 50MB of JavaScript, 5 different animation libraries, and a loading spinner that spins for 3 seconds.

I wanted something different...

[Read more - coming soon]`),
    ]),
  ]),
  createDirectory('misc', [
    createFile('.hidden-config', `# Hidden Configuration

This is a hidden file that only appears with ls -a`),
    createFile('now.txt', `# Now

What I'm currently focused on:

## Work
• Building Vault OS at Manhattan Wine Company
• Shopify app development for wine merchants
• Modernizing warehouse operations with software

## Side Projects
• This terminal portfolio
• SEC Form ADV scraper
• Dotfiles and developer tooling

## Learning
• AI/ML tooling and agent workflows
• Shopify app ecosystem
• Wine (WSET Level 2 certified)

Last updated: February 2026`),
    createFile('uses.txt', `# Uses

## Hardware
• Custom PC running WSL2 + Ubuntu
• Dual monitors

## Editor
• Neovim (primary — LSP, Treesitter, lazy.nvim)

## Terminal
• Zsh (979 lines of config)
• tmux
• fzf, ripgrep, fd, bat, eza

## Dev Tools
• Claude Code (AI pair programming)
• Docker
• Git
• Bun (JS/TS) + uv (Python)

## Services
• GitHub
• Vercel
• Sentry
• Shopify Partners`),
    createFile('colophon.md', `# Colophon

This site is built with:

- **Next.js 16** - React framework
- **xterm.js** - Terminal emulator
- **TypeScript** - Type safety
- **Tokyo Night** - Color theme

## Typography
- Monospace: JetBrains Mono / SF Mono

## Hosting
Deployed on Vercel with automatic deployments from GitHub.

---

Made with ⌨️ and ☕ by Otis Scott`),
  ]),
]);

// Git log data — auto-generated by scripts/update-git-log.sh via pre-commit hook
export const fakeCommits = gitCommits;

// Node version for prompt
export const NODE_VERSION = 'v20.11.0';
