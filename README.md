# proyek-web-ai
# README.md

# Saba Exploit Interactive OPREC Platform (Next.js + InsForge)

This is the central blueprint and documentation file for the official **Sapa Exploit Open Recruitment (OPREC) Platform**. This file serves as the strict contextual anchor and "Source of Truth" for AI Coding Assistants (e.g., Cloud Code, Claude, Cursor) working on this codebase.

---

## 1. Project Background & Context
**SabaExploIT (Sapa Exploit / SE)**, also known as the **Saba Cyber Community**, is the premier co-curricular student technology organization at **SMA Negeri 1 Bantul, Yogyakarta**. 

### Historical Legacy
The organization was founded in **2006** by four visionary students who were members of the school's Computer Olympiad Team: 
1. **Faizal Afnan**
2. **Fanni Suyuti**
3. **Isnawan Ibnu**
4. **Ghozy Ul-Haq**

They built Saba ExploIT to push past the limits of standard high school computer science. Today, Sapa Exploit functions as a semi-professional digital agency and creative production house with 38 to 39 active student members. It is dedicated to nurturing skills in programming, design, and audio-visual production, preparing students to become real-world tech entrepreneurs and creative professionals.

---

## 2. The Problem & The Solution

### The Old Way
Historically, student organizations presented their profiles during OPREC events using generic, boring slide decks (PowerPoint). This approach fails to excite incoming freshmen and fails to showcase Sapa Exploit's real technological expertise.

### The New Way: Two-Face Dynamic Web App
This platform is a cutting-edge, single-page application (SPA) built with a **"Two-Face" (Dual-Interface) Architecture** that serves both public recruitment and internal operations:
1. **The Public Face (Landing Page):** A visually arresting, highly interactive single-page profile designed to captivate new high school freshmen. It utilizes a bold, retro-comic **Deadpool Aesthetic** (Crimson Red, Pitch Black, Off-White) and a modern **Bento Grid layout** to partition complex organizational data seamlessly.
2. **The Developer/Admin Face (CMS Portal):** A secure admin panel accessible at `/admin`. This dynamic content management system (CMS) allows Sapa Exploit administrators to update club achievements, edit program descriptions, and upload recent togetherness gallery images without touch-editing HTML, CSS, or redeploying code.

---

## 3. Technology Stack

This application is built to be modern, scalable, and fully responsive:
* **Frontend Framework:** Next.js (App Router Architecture)
* **Styling & Layout:** Tailwind CSS (configured with a tactical Deadpool color palette)
* **Animations:** Framer Motion (for modal triggers, card expansions, and slick transitions)
* **Icons:** Lucide React
* **Backend Platform:** **InsForge Platform** (Y Combinator Spring 2026 Batch), which provides:
  * **Serverless Compute:** Running Edge Functions on Next.js routes.
  * **PostgreSQL Database:** Storing all dynamic content (Divisions, Programs, Achievements, Gallery metadata).
  * **Cloud Storage:** An S3-style storage bucket (`togetherness-gallery`) for host-secured media file uploads.
  * **Authentication:** Enforcing role-based JWT session security for administrator access.
  * **AI Model Gateway:** InsForge's OpenRouter gateway, called server-side via the OpenAI SDK (model `google/gemini-2.5-flash`) so the API key never reaches the browser.

---

## 4. Feature Specifications

### 4.1 Public Face Features

#### F01: Deadpool Cinematic Hero Section
* An expansive, immersive vertical grid (`100vh`) with comic borders.
* Highlights Sapa Exploit's core identity with an animated typography entrance reading `"WE ARE EXPLOIT"` and a pulsing call-to-action button ("Explore SABA") that smooth-scrolls users to the profile section.

#### F02: Bento Grid Profile & About Section
* Presents Sapa Exploit's history (founded in 2006 by the Computer Olympiad squad) and vision in highly organized, modular Bento boxes with rigid, solid drop-shadows.

#### F03: Interactive 5-Divisions Showcase
An interactive 1D column/grid representing Sapa Exploit's 5 functional departments:
1. **Photography:** Specialized in event coverage, visual composition, and film production support.
2. **Design:** Focused on graphic arts, UI layout, typography, and collaborative branding.
3. **Programming:** Covering webmaster skills, backend architecture, algorithmic problem solving, and siber security.
4. **Technopreneurship:** Merging technology mastery with business modeling, merchandising, and financial ops.
5. **Cinematography:** Specializing in short-film screenplay writing, cinematography, and post-production video editing.
* *Interactive Hook:* Hovering over any division triggers a smooth spring-animation flex expansion, revealing deep informational copy (fallback to *Lorem Ipsum* if undefined) and custom-rendered visual color palette accent guides.

#### F04: Program Kerja Explorer (Modals)
* Renders a layout grid for Sapa Exploit's 10 major group activities: **SEtrip, MUBES, SEtor, XIT Store, FPSE, XStory, VPSE, Artopia, Open Recruitment, and Ramber**.
* *Interactive Hook:* Clicking on a program badge blurs the background and launches a clean popup modal container displaying comprehensive program descriptions dynamically fetched from the PostgreSQL database.

#### F05: Dynamic Hall of Fame (Infinite Marquee)
* An endless, horizontal-scrolling text ticker containing Sapa Exploit's rich competition history (e.g., FLSSN National Photography awards, OSN Informatics, FIKSI Design honors). Ticker text is synced dynamically with database entries.

#### F06: Pinterest-Style Togetherness Gallery
* An asymmetric, masonry-style image layout showing the club's candid bonding moments. 
* Images load directly from secure InsForge Storage CDN URLs and open inside a beautiful Lightbox modal upon click.

#### F07: SabaBot Chatbot Widget
* A floating button in the bottom-right corner opening a comic-bubble chatbot interface.
* Users can query application requirements or club info. Text inputs are processed securely by a Next.js handler routing directly to Gemini via the InsForge Model Gateway, returning witty, Deadpool-style conversational replies.

#### F08: Hacker Terminal Mode (Easter Egg)
* Monitors keyboard input globally. If a user types the exact key sequence `S` -> `A` -> `B` -> `A`, a full-screen retro, green-on-black (`#00FF00`) JetBrains Mono command-line interface drops over the Bento UI.
* Freshmen can interact with the terminal by typing commands: `help` (list commands), `about` (hacker-style Sapa Exploit history since 2006), and `exit` (close, also bound to `Esc`).
* **Safety:** the global listener ignores keystrokes originating from any `<input>`, `<textarea>`, or content-editable element, so chatting with SabaBot or filling admin forms can never accidentally trigger it. The listener is cleaned up on unmount and restores body scroll on close.

---

### 4.2 Admin Face Features (`/admin`)

#### F09: Secure JWT Login Panel
* Protects the database management layer. Only authorized Sapa Exploit administrators can access the system after verifying credentials through InsForge Auth.

#### F10: Real-Time Dynamic CMS Dashboard
The dashboard (`/admin`) exposes a sidebar with five fully-functional management sections. Every write runs through an authenticated server-side InsForge client (passing RLS) and calls `revalidatePath("/")` so public-page changes appear immediately.
* **Hall of Fame (`/admin/achievements`):** Add new award text strings into the `achievements` table or delete old listings.
* **Programs (`/admin/programs`):** Select any of the 10 program profiles and edit their descriptive copy; Save enables only on change.
* **Gallery (`/admin/gallery`):** File uploader with client-side validation (image only, ≤ 8 MB). Photos are stored in the `togetherness-gallery` InsForge Storage bucket, and both the public `url` and storage `key` are logged to the `gallery` table — so deletes remove the Storage object too (no orphaned files).
* **Divisions (`/admin/divisions`):** Edit the 5 division descriptions, sub-descriptions, icon, and color palette rendered on the public showcase (F03).
* **Site Content (`/admin/content`):** Edit free-form site copy (e.g. Hero and About text in the `site_content` table) that drives the F01/F02 sections — fully no-code.

---

## 5. Directory Mapping & Codebase Layout

```bash
proyek-web-ai/
├── db/                          # SQL run in the InsForge console
│   ├── 01_schema.sql            # Tables: divisions, programs, achievements, gallery, site_content
│   ├── 02_policies.sql          # RLS: anon = SELECT only, authenticated = CRUD
│   └── 03_seed.sql              # Base profile data
├── insforge.toml                # Declarative auth/backend config (cli config apply)
├── src/
│   ├── proxy.ts                 # Next 16 "Proxy" (ex-middleware): protects /admin/*
│   ├── app/
│   │   ├── layout.tsx           # Global fonts (Outfit, Inter, JetBrains Mono) & metadata
│   │   ├── page.tsx             # Public landing — composes all sections + mounts widgets
│   │   ├── globals.css          # Tailwind v4 @theme design tokens + keyframes
│   │   ├── admin/
│   │   │   ├── login/           # Auth login (Server Action → InsForge signInWithPassword)
│   │   │   └── (protected)/     # Auth-gated route group (layout redirects if no session)
│   │   │       ├── page.tsx     # Dashboard with Bento stat cards
│   │   │       ├── AdminSidebar.tsx
│   │   │       ├── achievements/ programs/ gallery/ divisions/ content/  # CRUD sections
│   │   └── api/
│   │       └── chat/route.ts    # Server-side AI handler (OpenAI SDK → InsForge OpenRouter)
│   ├── components/
│   │   ├── Navbar.tsx           # Anchor-link navigation
│   │   ├── Hero.tsx             # Cinematic Deadpool intro panel
│   │   ├── About.tsx            # Dynamic bento about section
│   │   ├── Divisions.tsx        # Flex-hover division expander cards
│   │   ├── ProkerGrid.tsx       # Dynamic programs list cards (client, owns modal state)
│   │   ├── ProkerModal.tsx      # Backdrop-blur modal portal
│   │   ├── HallOfFame.tsx       # Infinite CSS marquee
│   │   ├── Gallery.tsx          # Masonry photo grid + Lightbox
│   │   ├── SabaBot.tsx          # Floating chatbot widget
│   │   └── TerminalMode.tsx     # "SABA" CLI retro hacking overlay (Easter Egg)
│   └── lib/
│       ├── insforge.ts          # Browser anon @insforge/sdk client
│       ├── insforge-server.ts   # Server (cookie-based) client + getSessionUser()
│       ├── data.ts              # Public-page data fetchers
│       ├── types.ts             # Shared row types
│       └── icons.ts             # lucide icon name → component map
```

---

## 6. Development Rules for AI Agents
1. **Never hardcode values:** All content listed under Programs, Achievements, and Gallery must be retrieved dynamically from PostgreSQL or InsForge Storage via the official `@insforge/sdk`.
2. **Strict Design Tokens:** You must exclusively use colors and spacing scales specified in `DESIGN.md` to avoid visual slop.
3. **Component Splitting:** Keep client components separated by using the `"use client";` directive at the top of files that require state or animations (e.g., Framer Motion, key event listeners, or click forms).
4. **Step-by-Step Implementation:** Do not create or write entire directories in a single command. Follow the task sequence in `Actionable_Task_Breakdown.md` and report progress after each file creation.