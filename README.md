# AI Agent Starter

A small, real Next.js AI agent that uses the OpenAI Responses API and function calling. It includes a safe calculator tool and an agent loop with a step limit.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Add your OpenAI API key to `OPENAI_API_KEY`.
4. Optionally change `OPENAI_MODEL`.
5. Run:

```bash
npm install
npm run dev
```

6. Open `http://localhost:3000`.

## How it works

`app/page.tsx` → POST `/api/agent` → `lib/agent.ts` → Responses API → optional calculator tool → tool result → model → final answer.

The API key is server-side only. Never put it in client-side code or `NEXT_PUBLIC_*` variables.

## Next upgrades

- Add web search as a managed tool.
- Add file/document retrieval.
- Add persistent memory with PostgreSQL.
- Add authentication and per-user agent runs.
- Add human approval before external side effects such as email or database writes.
- Add streaming events and run history.
