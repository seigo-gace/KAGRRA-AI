import express from "express";
import { KagrraRuntime } from "../core/KagrraRuntime.js";
import { createContext } from "../runtimeContext.js";

export async function startDashboard(port: number): Promise<void> {
  const app = express();
  app.use(express.json());

  const runtime = new KagrraRuntime(createContext(), process.env.GEMINI_API_KEY);

  app.get("/", (_req, res) => {
    res.type("html").send(`
<!doctype html>
<html>
<head><title>KAGRRA Dashboard</title></head>
<body>
<h1>KAGRRA Dashboard</h1>
<button onclick="doctor()">Doctor</button>
<button onclick="evidence()">Evidence</button>
<pre id="out"></pre>
<script>
async function doctor(){document.getElementById('out').textContent=JSON.stringify(await (await fetch('/api/doctor')).json(),null,2)}
async function evidence(){document.getElementById('out').textContent=JSON.stringify(await (await fetch('/api/evidence')).json(),null,2)}
</script>
</body>
</html>
`);
  });

  app.get("/api/doctor", async (_req, res) => res.json(await runtime.doctor()));
  app.get("/api/evidence", async (_req, res) => res.json(await runtime.evidence()));
  app.post("/api/run", async (req, res) => res.json(await runtime.run(String(req.body.task ?? ""))));

  app.listen(port, () => {
    console.log(`KAGRRA dashboard listening on http://localhost:${port}`);
  });
}
