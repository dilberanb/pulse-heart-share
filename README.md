# Heartbeat Hub

Act as an Expert Full-Stack Developer and UI/UX Architect.

I am building a real-time social well-being and status-sharing application. Users will update their current emotional, physical, and situational states (choosing from over 100+ predefined micro-statuses like "Sick", "Peaceful", "Anxious", "Need Help"), and their connected loved ones will see these updates in real-time. I am starting this project with you (Lovable) to build the foundational UI and architecture, but I will soon export this to my local environment for custom backend integration and further engineering. Therefore, the code must be exceptionally clean, modular, scalable, and strictly adhere to best practices.

1. Tech Stack & Engineering Standards

Framework: React (via Vite) or Next.js (App Router). Use TypeScript strictly.

Styling: Tailwind CSS combined with Shadcn UI for accessible, reusable, and modern components.

State Management: Zustand for global state (user session, active filters) and React Query for server state.

Database/Real-time: Assume a Supabase-like architecture. Structure the UI to easily accept real-time WebSocket subscriptions.

Architecture: Use feature-based folder structure (e.g., /components, /hooks, /types, /utils, /features/status, /features/auth). Keep components small and single-responsibility.

Code Quality: Include descriptive comments for complex logic. Use clear, self-documenting variable names. No hardcoded mock data in components; abstract all mock data into a separate mockApi.ts file so I can easily swap it with a real backend later.

2. Core Features & UX Flow

Live Dashboard (The "Pulse" Feed): A masonry or list layout showing the current statuses of connected people. Each card should show the user's avatar, their current status emoji/icon, the timestamp (e.g., "Updated 10 mins ago"), and a background color reflecting the mood category.

Status Update Interface: A heavily optimized, frictionless modal or bottom sheet.

Must include a fast search bar to filter through the 100+ statuses.

Statuses must be categorized: Emotions (Happy, Anxious, Sad), Physical (Sick, Energetic, Tired), Needs (Need a Call, Need Help, Want Company).

Privacy Circles (Feature Injection): Users can tag a status visibility: "Everyone", "Close Friends", or "Inner Circle (Family)". Build the UI dropdown to support this selection.

Emergency / SOS Mode: A highly visible, specialized red button for critical states (e.g., "Medical Emergency", "Stranded"). These should override normal UI patterns and display with a pulsating alert on the receiver's dashboard.

Micro-Interactions (One-Tap Empathy): Instead of text comments, receivers can long-press a status to send a "Virtual Hug", "Heart", or "Coffee" icon.

Status Expiration (Ephemeral States): UI should indicate that statuses older than 24 hours expire or fade out, prompting the user to ask, "Are you okay? No update today." Add a "Nudge" button to request an update.

3. Design System & UI Language

Theme: Minimalist, empathetic, and visually calming. Avoid aggressive social media patterns (no endless scrolling algorithms, no follower counts). Support Dark and Light mode.

Typography: Inter or SF Pro. Clean, highly legible, focused on readability for older family members.

Color Palette (Semantic Statuses):

Neutral/Calm: Soft Blues and Greens.

High Energy/Happy: Warm Yellows and Oranges.

Negative/Low: Muted Purples and Grays.

Urgent/Help: Solid, accessible Red (ensure high contrast).

Animations: Use Framer Motion (or Tailwind arbitrary values) for soft, fluid transitions. Modals should slide up gently. Status updates should pop in with a subtle scale effect.

4. Initial Task (Phase 1 MVP)

Please generate the initial scaffolding for this application. Start by building:

The main Layout (Sidebar/Bottom navigation depending on mobile-first approach).

The Live Dashboard Feed displaying a mocked list of family members with varying statuses (use vibrant, distinct UI cards for different status categories).

The Status Update Modal showing the categorized grid of statuses and a search bar.

Write production-ready, exportable code. Let's begin with the Dashboard UI. Uygulama Türkçe olacak.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pulse-heart-share.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bdfb9c87-64f7-49fa-9898-6c386e5b6051).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
