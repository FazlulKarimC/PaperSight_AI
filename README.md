# PaperSight AI

An AI document tool where you can actually see the retrieval happening.

Upload a PDF, get a structured summary, then chat with the document — with every AI answer showing exactly which passages it pulled from, how relevant they were, and why. Not another Gemini wrapper with a file input. The RAG pipeline is the product, and it's visible.

---

## What's Inside

- **RAG you can see** — every chat response shows expandable source citation cards with the exact chunks retrieved via pgvector cosine similarity, scored by relevance. The chat header shows a persistent "RAG · Grounded" badge; while processing, a three-stage animation telegraphs the pipeline: *Retrieving context → Ranking passages → Generating response*.

- **Client-side PDF parsing** — `pdfjs-dist` extracts text in the browser before anything hits the server. Batch upload up to 5 PDFs, combine them into one summary. Scanned-image PDFs get caught early with a clear error, not after a 30-second upload.

- **Real streaming, not fake** — summaries and chat responses stream token-by-token via SSE. The upload flow has six distinct stages (parse → upload → summarize → save → index → redirect), each with its own progress state and toast. Abort at any point.

- **Guest access with teeth** — no sign-up wall. Guests get 10 summaries/day via a cookie-based rate limiter with server-side validation. Summary viewing works, chat requires auth (needs user-scoped embeddings).

- **Five summary styles** — same document, different output. Viral, academic, executive, bullet-point, and detailed. Backed by style-specific Gemini system prompts, not just a temperature slider.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16.1.6, React 19, TypeScript | App Router, RSCs for the summary page, Turbopack dev |
| AI | Gemini (`@google/genai`) | `gemini-3-flash-preview` for generation, `gemini-embedding-001` (768d) for embeddings |
| Vector DB | Neon Postgres + pgvector | `<=>` cosine similarity operator, raw SQL via Prisma for vector columns |
| ORM | Prisma 7 + `@prisma/adapter-neon` | Driver adapter for serverless Neon, `Unsupported("vector(768)")` for the embedding column |
| Auth | Clerk | Middleware-based, guest fallback via UUID cookie |
| File storage | UploadThing | PDF storage for signed-in users; guests skip storage, still get summaries |
| PDF parsing | `pdfjs-dist` (client), `pdf-parse` (server) | Client-side extraction avoids uploading raw PDFs for text-only summarization |
| Data fetching | SWR | Stale-while-revalidate for summaries list and chat history |
| Styling | Tailwind 4 + custom design system | Editorial Tech aesthetic — Instrument Serif headings, Geist Mono labels, oklch palette |
| Animations | Framer Motion 12 | Reduced-motion aware, editorial easing (no spring/bounce), <400ms max |
| UI primitives | Radix UI + shadcn/ui components | Accessible by default |

---

## Getting Started

```bash
git clone <repo-url>
cd papersight_ai
npm install
```

Create `.env.local`:

```env
# Required
DATABASE_URL=            # Neon Postgres connection string (must have pgvector enabled)
GEMINI_API_KEY=          # Google AI Studio key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_TOKEN=       # From uploadthing.com dashboard

# Optional
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Then:

```bash
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema to Neon
npm run dev
```

> **Gotcha**: The `pdf_embeddings` table uses a `vector(768)` column. Make sure `pgvector` is enabled on your Neon project (`CREATE EXTENSION IF NOT EXISTS vector;`).

---

## Project Structure

```
app/
  page.tsx                    # Landing — hero, features, upload CTA
  upload/page.tsx             # Multi-file upload with streaming preview
  summary/[id]/               # Summary view + PDF split panel + chat
  dashboard/                  # User's saved summaries
  api/
    chat/route.ts             # RAG chat — embed query, search chunks, stream response
    summarize-text/route.ts   # Streaming Gemini summarization via SSE
    save-summary/route.ts     # Persist summary + trigger background indexing
    uploadthing/              # File upload handler

components/
  summary/
    chat-panel.tsx            # Floating chat with source citations, RAG badge, streaming cursor
    pdf-viewer.tsx            # Resizable split-panel (summary + PDF iframe)
    summary-list.tsx          # Dashboard grid with SWR
  hero.tsx                    # Landing hero with live summary preview animation
  features.tsx                # Feature grid — Chat + RAG dominate top row

lib/
  embeddings.ts               # Chunking (500 words, 50 overlap), embed, store, vector search
  gemini.ts                   # Gemini client config
  pdf-parser-client.ts        # Browser-side pdfjs-dist extraction with batch support
  guest-rate-limit.ts         # Server-side cookie-based rate limiting
```

---

## Design System

**Editorial Tech** — the visual language sits between a high-end digital publication and a developer tool.

- **Typography**: Instrument Serif (400 italic) for headings — dramatic, authoritative. Geist for body. Geist Mono for labels, badges, and metadata — always uppercase, tracked wide.
- **Color**: oklch throughout. Deep navy-charcoal background (`0.13 0.01 260`). Warm amber accent (`0.78 0.16 55`) — used only for CTAs, active states, RAG indicators, and links. One accent color, no rainbow.
- **Surfaces**: `surface-raised` (card bg + 1px border + layered shadows) and `surface-sunken` (inputs, recessed areas). No glassmorphism, no heavy shadows.
- **Animation**: Max 400ms. `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)`. No spring, no bounce. Entry = fade + translateY(8px). Exit = fast fade only.

Full spec in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

## Screenshots

> Screenshots should be added here: landing page, upload flow with streaming preview, summary view with PDF split panel, chat with source citations visible.

---

## What I'd Do Differently

- **Embeddings should be generated at upload time, not on first chat.** Right now, if a user opens chat on a document that hasn't been indexed yet, there's a noticeable cold-start delay while chunks are embedded. A background job triggered right after save would fix this — the fire-and-forget `fetch` in `use-pdf-upload.ts` is a workaround, not a solution.

- **The vector search needs a similarity threshold, not just top-K.** Currently it returns the 5 most similar chunks regardless of score. If a user asks something completely unrelated to the document, it still retrieves low-relevance chunks and the AI tries to answer from them. A `WHERE similarity > 0.3` filter would fix the hallucination edge case.

- **The chat should be a full-page layout on desktop, not a floating widget.** The 420px floating panel works but wastes screen real estate. A proper three-column layout (nav | summary+PDF | chat) on the summary page would make this feel like an actual research tool. The floating panel is still fine for mobile.

---

## Author

[Fazlul Karim](https://github.com/FazlulKarimC)
