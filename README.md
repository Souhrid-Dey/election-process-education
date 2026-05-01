# Election Process Education

An interactive AI assistant that helps users understand U.S. elections — voter registration, the Electoral College, primary types, timelines, and more. Powered by Claude AI with streaming responses and a strict nonpartisan stance.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.example .env.local
# edit .env.local → set ANTHROPIC_API_KEY

# 3. Run the dev server
npm run dev
# → http://localhost:3000
```

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** with civic color palette
- **Anthropic SDK** — `claude-opus-4-7` with adaptive thinking + streaming
- **Prompt caching** on the shared election knowledge base

## Project Status

See [Instruction.md](./Instruction.md) for the full phase-wise build plan.

| Phase | Status |
|-------|--------|
| 1 — Foundation (scaffold + types) | ✅ Complete |
| 2 — UI Shell | ⬜ Pending |
| 3 — AI Chat (streaming) | ⬜ Pending |
| 4 — Rich Content (timeline, steps) | ⬜ Pending |
| 5 — Polish & Accessibility | ⬜ Pending |
| 6 — Deploy (Vercel) | ⬜ Pending |
