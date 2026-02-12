/**
 * Filesystem Data
 * Virtual filesystem content for the terminal
 */

import { DirectoryNode, FileNode } from './types';

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

Fine asset management SaaS built by The American Storage Company for Manhattan Wine Company.

## What It Does
- Wine inventory tracking with LWIN integration
- Client account management and portals
- Warehouse operations (inbound/outbound, cycle counts)
- Reporting and analytics

## Tech Stack
- Django + Django REST Framework (API)
- React + TypeScript (frontend)
- PostgreSQL + Redis (data layer)
- Docker (deployment)

🔗 https://theamericanstoragecompany.com`),
    createFile('dataearn.md', `# DataEarn

Data monetization platform — co-founded in 2020.

## What It Does
- Allows users to monetize their personal data
- Connects data providers with buyers through a marketplace
- Handles consent, privacy, and compliance

## Tech Stack
- Django + DRF (backend API)
- Next.js + React (frontend)
- Azure (cloud infrastructure)
- PostgreSQL (database)

🔗 https://dataearn.com`),
    createFile('lwin-mapping.md', `# LWIN Mapping

Shopify app for wine inventory and appraisal management.

## What It Does
- Maps wine products to LWIN (London International Vintners Exchange) identifiers
- Provides market value appraisals for wine inventory
- Bulk import/export for catalog management

## Tech Stack
- React Router 7 (Remix)
- Prisma (ORM)
- Sentry (error tracking)
- Shopify App Bridge

🔒 Shopify App Store — in development`),
    createFile('sec-scraper.md', `# SEC Form ADV Scraper

Open source tool for automated SEC filing consumption.

## What It Does
- Scrapes SEC EDGAR for Form ADV filings
- Extracts structured data from XML and PDF documents
- Handles rate limiting and incremental updates

## Tech Stack
- Python
- XML/PDF parsing
- SEC EDGAR API

🔗 github.com/otisscott`),
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

Heavily documented personal configuration.

## Includes
- Neovim config (LSP, Treesitter, custom keymaps)
- Zsh config (979 lines of aliases, functions, prompts)
- Claude Code rules and agent configuration
- tmux, git, and tool configs

## Highlights
- Modular Neovim setup with lazy.nvim
- Custom Zsh prompt with git integration
- Extensive Claude Code skill library

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

// Git-like fake commits for the git log command
export const fakeCommits = [
  { hash: 'a1b2c3d', message: 'feat: add neofetch easter egg', date: '2026-02-10', author: 'Otis Scott' },
  { hash: 'e4f5g6h', message: 'feat: implement tab completion', date: '2026-02-09', author: 'Otis Scott' },
  { hash: 'i7j8k9l', message: 'style: tokyo night theme', date: '2026-02-08', author: 'Otis Scott' },
  { hash: 'm0n1o2p', message: 'feat: add filesystem navigation commands', date: '2026-02-07', author: 'Otis Scott' },
  { hash: 'q3r4s5t', message: 'feat: initial terminal setup', date: '2026-02-06', author: 'Otis Scott' },
  { hash: 'u6v7w8x', message: 'chore: project setup with next.js', date: '2026-02-05', author: 'Otis Scott' },
];

// Node version for prompt
export const NODE_VERSION = 'v20.11.0';
