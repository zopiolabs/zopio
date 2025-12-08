# Parlant Server (Zopio Integration)

This app runs a local Parlant server as part of the Zopio monorepo. It is intended for:

- Local development and pilot tests of Parlant-based agents.
- Feeding the `/parlant` proxy in `apps/api` and the `parlant-chat-react` demo pages in `apps/app`.

## Layout

- `apps/parlant-server/requirements.txt` — Python dependencies (Parlant server SDK).
- `apps/parlant-server/main.py` — Entry point that starts the Parlant HTTP server.

## Running the server locally

1. Create and activate a Python 3.10+ virtual environment.
2. Install dependencies:

   ```bash
   cd apps/parlant-server
   pip install -r requirements.txt
   ```

3. Configure LLM provider (default is OpenAI via `NLPServices.openai`):

   ```bash
   # Example for OpenAI
   export OPENAI_API_KEY="sk-..."

   # Optional: choose a different NLP backend
   #   openai   (default if unset)
   #   ollama   (requires OLLAMA_* env vars)
   #   vertex   (requires VERTEX_AI_* env vars)
   #   snowflake (requires SNOWFLAKE_* env vars)
   export PARLANT_NLP_SERVICE="openai"
   ```

4. Start the server (default ports match Parlant docs and the Zopio proxy):

   ```bash
   # Optional overrides
   export PARLANT_SERVER_PORT=8800
   export PARLANT_TOOL_SERVICE_PORT=8818
   export PARLANT_SESSION_STORE="local"        # default
   export PARLANT_CUSTOMER_STORE="local"       # default

   python3 main.py
   ```

The Parlant HTTP API and playground will be available at:

- `http://localhost:${PARLANT_SERVER_PORT:-8800}`

## Connecting from Zopio apps

- The API app proxies traffic to Parlant via:
  - `apps/api/app/parlant/[...path]/route.ts`
  - Configure `PARLANT_SERVER_URL` (for example `http://localhost:8800`) in the API environment.

- The frontend app uses the proxy via `parlant-chat-react`:
  - Shared client component: `apps/app/app/parlant-demo/parlant-chat.tsx`
  - Public demo page: `apps/app/app/(unauthenticated)/parlant-demo/page.tsx`
  - Internal demo page: `apps/app/app/(authenticated)/parlant-demo-internal/page.tsx`
  - Configure:
    - `NEXT_PUBLIC_API_URL` → base URL of `apps/api`
    - `NEXT_PUBLIC_PARLANT_AGENT_ID` → ID of the Parlant agent to talk to

With these set, the Zopio frontend will talk to the in-repo Parlant server via the `/parlant` proxy.

