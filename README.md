# Fyke's Laboratory

A gaming-themed portfolio with retro arcade aesthetics. Level 75 Full-Stack Developer — Class: Guardian of Chaotic Plans.

**Live:** [fykelabs.vercel.app](https://fykelabs.vercel.app)

---

## Overview

Fyke's Laboratory is an interactive portfolio disguised as a retro RPG game interface. It showcases projects, skills, achievements, and experience through gaming metaphors — quests instead of tasks, achievements instead of accomplishments, an inventory system for tools and equipment.

The site features two distinct themes: the default dark **Retro** mode with a circuit board aesthetic, and the **Ally** theme variant with a pink garden atmosphere and falling sakura leaves.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| UI Primitives | Radix UI (8-bit styled) |
| Email | Resend |
| State | next-themes |
| Icons | lucide-react, react-icons |

---

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
RESEND_API_KEY=your_resend_api_key
```

Required for the contact form to send emails.

---

## Project Structure

```
fyketonel/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home page (player profile, stats, games)
│   ├── plans/page.tsx          # Quest log, chaos meter, experiments
│   ├── projects/page.tsx       # Project showcase (S-tier to D-tier)
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── globals.css             # Global styles + Tailwind 4 config
│   └── api/
│       ├── contact/route.ts    # Contact form email handler
│       └── joke/route.ts       # Dad joke API
│
├── components/
│   ├── retro-*.tsx             # Navigation, footer, background
│   ├── skill-tree.tsx          # Interactive skill tree (5 branches)
│   ├── achievement-wall.tsx    # Trophy case with pixel badges
│   ├── github-contributions.tsx # GitHub activity chart
│   ├── inventory-system.tsx    # Equipment display (6 slots)
│   ├── technologies-carousel.tsx # Tech stack showcase
│   ├── quest-log.tsx           # Quest tracking system
│   ├── chaos-meter-dashboard.tsx # Chaos planning HQ
│   ├── laboratory-experiments-log.tsx # Experiment tracking
│   ├── warp-drive-timeline.tsx # 6-week experimental timeline
│   ├── interactive-calendar.tsx # Mission planner calendar
│   ├── arcade-center.tsx       # Game selector hub
│   ├── hockey-game.tsx         # Air hockey mini-game
│   ├── chess-game.tsx           # Chess against CPU
│   ├── snake-game.tsx           # Snake game
│   ├── minesweeper-game.tsx    # Minesweeper
│   ├── othello-game.tsx        # Othello/Reversi
│   ├── sudoku-game.tsx         # Sudoku puzzle
│   ├── tictactoe-game.tsx      # Tic-tac-toe
│   └── ui/8bit/                # Retro pixel-art UI components
│       ├── button.tsx, card.tsx, input.tsx, etc.
│       └── blocks/player-profile-card.tsx
│
├── lib/
│   ├── utils.ts                # cn() utility
│   ├── contact-device-id.ts    # Device fingerprinting
│   └── contact-rate-limit.ts   # Rate limiting (3 per 5 hours)
│
└── public/assets/              # Pixel art assets
    ├── sakura_leaf.png         # Ally theme particle
    ├── flower_petal_*.png      # Ally theme particles
    ├── tulip.png               # Ally theme decoration
    └── ProjectPictures/        # Project screenshots
```

---

## Features

### Themes

**Retro Theme (Default)**
- Dark circuit board background with animated data flow traces
- Neon purple accent color scheme
- Pixel-art fonts (Press Start 2P, Kongtext)
- Offset shadow technique for pixel depth

**Ally Theme**
- Pink garden aesthetic with gradient background
- Falling sakura leaf animation (3 particle types)
- Tulip border decorations
- Triggered by setting `terminal-theme` to `"ally"` in localStorage

Toggle themes via the sun/moon icon in the navigation.

### Home Page

- **Player Profile Card** — Level 75, RPG stats (Health, Mana, Experience, Stamina)
- **Mission Planner Calendar** — Gamified calendar with daily events, boss battles, quests
- **GitHub Contributions** — 12-month contribution chart
- **Technologies Carousel** — Auto-playing tech stack showcase (45+ technologies)
- **Achievement Wall** — Trophy case with rarity tiers (Common, Rare, Legendary)
- **Inventory System** — Equipment slots with stat bonuses
- **Skill Tree** — Interactive 5-branch skill tree (Frontend, Backend, DevOps, Design, Core)
- **Arcade Center** — 7 playable mini-games
- **Joke of the Day** — Random dad jokes from API

### Projects Page

17 projects organized by tier:

| Tier | Description | Projects |
|------|-------------|----------|
| **S** | Prime Directive | Flick Player, Pasada Admin, Pasada Passenger |
| **A** | Field Operations | Pasada Driver, Pasada Website, Locker, Mochi, Revo, Papa Burger, LootBX |
| **B** | Living Exhibit | Fyke's Laboratory (self), br41ndmg |
| **C** | Pocket Labs | Project Fyke, Appointment Scheduler, Live Calendar |
| **D** | Arcade Relics | Simple Calculator, Building Blocks |

### Plans Page

- **Quest Log** — Main/side/daily quests with difficulty (1-5 skulls), EXP rewards, achievements
- **Laboratory Experiments** — 4 documented experiments with hypothesis, variables, results
- **Chaos Meter** — 87% chaos level with categorized plan lists
- **Warp Drive Timeline** — 6-week experimental timeline with status tracking

### Arcade Games

1. **Air Hockey** — Mouse/touch control, AI opponent, first to 6 wins
2. **Chess** — Classic chess against CPU
3. **Snake** — Classic snake gameplay with best score persistence
4. **Minesweeper** — Grid-based bomb detection
5. **Othello** — 8x8 disc flipping against CPU
6. **TicTacToe** — X and O against CPU
7. **Sudoku** — Number puzzle with validation

### Contact Form

- Email and message fields
- Device ID tracking for rate limiting (3 emails per 5 hours per device)
- Resend API integration
- Confirmation and error states

---

## Design Philosophy

The portfolio embraces the **"Guardian of Chaotic Plans"** persona:

- RPG gaming metaphors throughout (quests, achievements, skills, inventory)
- Self-aware humor about chaos and planning
- Pixel-art aesthetic with modern React functionality
- Interactive mini-games demonstrating development capability
- Two distinct theme modes: dark retro vs. pink garden Ally

---

## Development Notes

### Theme Implementation

Themes use `next-themes` with `ThemeProvider` in `app/layout.tsx`:

```typescript
// Theme stored in localStorage as "terminal-theme"
// Values: "dark" (default), "light", "ally"

// Listen for changes
window.addEventListener("themeChanged", callback);
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact` | POST | Send contact email (rate limited) |
| `/api/joke` | GET | Get random dad joke |

### CSS Architecture

- Tailwind CSS 4 with CSS-first configuration
- CSS variables for all theme colors (oklch color space)
- Zero border-radius for pixel-art aesthetic
- Offset shadows: `shadow-[4px_4px_0_var(--border)]`

### Animation Strategy

- Framer Motion for component animations
- CSS keyframes for background particles
- Custom spring configs via `motion-utils.ts`

---

## License

MIT —Fyke Simon V. Tonel
