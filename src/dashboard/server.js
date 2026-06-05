import http from "node:http";
import { KagrraRuntime } from "../core/KagrraRuntime.js";
import { createContext } from "../runtimeContext.js";

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  try { return JSON.parse(raw || "{}"); } catch { return {}; }
}

export async function startDashboard(port) {
  const runtime = new KagrraRuntime(createContext(), process.env.GEMINI_API_KEY);

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<!doctype html>
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
</html>`);
        return;
      }

      if (req.url === "/api/doctor") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await runtime.doctor(), null, 2));
        return;
      }

      if (req.url === "/api/evidence") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await runtime.evidence(), null, 2));
        return;
      }

      if (req.url === "/api/run" && req.method === "POST") {
        const body = await readBody(req);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await runtime.run(String(body.task ?? "")), null, 2));
        return;
      }

      res.writeHead(404);
      res.end("not found");
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  server.listen(port, () => {
    console.log(`KAGRRA dashboard listening on http://localhost:${port}`);
  });
}
