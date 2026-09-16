# DocuMind SLM — Local Document Intelligence & Anomaly Engine

> **100% Local, Layout-Aware Document AI Powered by Open-Weights SLMs**  
> *Track 3: AI/ML & Deep Learning | Aether HackConquest*  
> **100% On-Premise & DPDP Act 2023 Compliant | Processing Cost: ₹0.25/page**

---

## System Architecture

```
[ PDF / Scan Input (Up to 10 MB) ]
               │
               ▼
   [ PyMuPDF 2D Coordinate Normalization ] 
         (Bounding Boxes [0, 1000])
               │
               ▼
   [ Llama-3.2-3B-Instruct 4-bit GGUF SLM ]
   (llama-cpp-python / Instructor Grammar)
               │
               ▼
   [ Deterministic Math & Anomaly Audit ]
      (Subtotal + GST == Total Check)
       /                             \
   [Pass]                           [Fail]
     │                                │
     ▼                                ▼
[Supabase DB / Ledger]      [HITL Cockpit Queue (Ctrl+Enter)]
```

---

## 1. Local SLM Weights & Mock Fallback Configuration

* **Real Hardware Inference by Default (`MOCK_FALLBACK=false`):**  
  Real local SLM inference is the default. If model weights are missing from `./models/llama-3.2-3b-instruct-q4_k_m.gguf` and `MOCK_FALLBACK` is false, the engine refuses extraction requests with an explicit `503 Service Unavailable` error directing you to download the model.
* **Opting Into Mock Simulation Mode (`MOCK_FALLBACK=true`):**  
  For rapid offline development or testing without downloading the ~2.0 GB weights, set `MOCK_FALLBACK=true` in your `.env` or `docker-compose.yml`.
* **Unmissable Mock Indicator in UI & API:**  
  Whenever a mock result is served, the API includes `"source": "mock_fallback"`, and the web cockpit renders a prominent warning banner:
  > `⚠️ MOCK RESULT — Model weights not loaded. Running in simulation mode (MOCK_FALLBACK=true). Download Llama-3.2-3B GGUF weights to activate real on-premise SLM inference.`

### Downloading the Llama-3.2-3B Model Weights
```bash
python services/ai-engine/models/download_model.py
```
This downloads `llama-3.2-3b-instruct-q4_k_m.gguf` directly from Hugging Face into `services/ai-engine/models/`.

---

## 2. Authentication & Security Architecture

DocuMind SLM enforces defense-in-depth authentication across all tiers:

```
[ Browser / Cockpit UI ] ──(Supabase Auth / Demo Auditor Session)──▶ [ Next.js App Router ]
                                                                             │
                                              (Bearer DOCUMIND_API_KEY)     │
                                                                             ▼
                                                                  [ FastAPI Engine :8000 ]
                                                                  (Requires 401 Bearer Auth)
                                                                             │
                                        (Elevated Service Role / Server Only)│
                                                                             ▼
                                                                   [ Supabase Database ]
                                                                 (Row Level Security: RLS)
```

1. **FastAPI Engine Security:**  
   All extraction endpoints (`/api/v1/extract/*` and `/api/v1/upload-and-extract`) require an `Authorization: Bearer <DOCUMIND_API_KEY>` header. Unauthenticated requests are rejected immediately with `401 Unauthorized`. The `/health` route remains accessible for container orchestrator healthchecks.
2. **Web Cockpit Access Gate:**  
   Access to the dashboard and API routes is gated by `AuthGate`:
   * Evaluators and judges can click **"Enter as Certified Demo Auditor (Hackathon Mode)"** for zero-friction offline testing.
   * Full email/password or passwordless magic-link sign-in is supported via Supabase Auth when cloud credentials are configured.
   * Unauthenticated requests to `/api/extract` or `/api/audit` are rejected with `401 Unauthorized`.
3. **Database Row Level Security (RLS):**  
   All tables (`documents`, `extractions`, `hitl_reviews`) and the `document-vault` storage bucket have RLS enabled via [`supabase/migrations/20260916_auth_and_rls.sql`](./supabase/migrations/20260916_auth_and_rls.sql). Only authenticated sessions and the backend service role have read/write access.

---

## 3. Service-Role Key Isolation (Audit Verified)

* `SUPABASE_SERVICE_ROLE_KEY` is **strictly confined to server-side code**:
  * In the FastAPI backend container (`services/ai-engine`).
  * In `web/lib/supabase-server.ts`, which is imported exclusively within server-side route handlers (`app/api/*`).
* The browser client (`web/lib/supabase.ts`) uses **only** `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
* Automated build audits confirm that `SERVICE_ROLE` does not appear anywhere in client-side bundles, DOM attributes, or API response bodies.

---

## 4. Quickstart in VS Code

### 1. Open in VS Code
```bash
code C:\Users\Admin\.gemini\antigravity\scratch\documind-slm
```

### 2. Start the AI Inference Engine (FastAPI)
```bash
cd services/ai-engine
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Health check: `http://localhost:8000/health`
* Interactive Swagger Docs: `http://localhost:8000/docs`

### 3. Start the Next.js 14 Web Cockpit
In a second terminal:
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Log in using your Supabase account or click **"Enter as Certified Demo Auditor"**.

---

## 5. Running with Docker Compose
```bash
docker compose up --build
```
* Web Dashboard: `http://localhost:3000`
* AI Engine API: `http://localhost:8000`

---

## 6. Supabase Database Migration
1. Open your Supabase Dashboard SQL Editor.
2. Run [`supabase/migrations/20260916_init.sql`](./supabase/migrations/20260916_init.sql).
3. Run [`supabase/migrations/20260916_auth_and_rls.sql`](./supabase/migrations/20260916_auth_and_rls.sql).
4. (Optional) Seed the benchmark invoice using [`supabase/seed/sample_invoices.sql`](./supabase/seed/sample_invoices.sql).
