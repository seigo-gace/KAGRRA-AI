import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { KagrraRuntime } from "../core/KagrraRuntime.js";
import { createContext } from "../runtimeContext.js";

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function htmlPage(): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>KAGRRA Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; line-height: 1.5; }
    button { margin-right: 8px; margin-bottom: 8px; }
    pre { background: #111; color: #ddd; padding: 16px; border-radius: 12px; overflow: auto; }
  </style>
</head>
<body>
  <h1>KAGRRA Dashboard</h1>
  <p>Runtime diagnostics and evidence viewer.</p>
  <button onclick="doctor()">Doctor</button>
  <button onclick="evidence()">Evidence</button>
  <pre id="out">Ready.</pre>
  <script>
    async function doctor(){document.getElementById('out').textContent=JSON.stringify(await (await fetch('/api/doctor')).json(),null,2)}
    async function evidence(){document.getElementById('out').textContent=JSON.stringify(await (await fetch('/api/evidence')).json(),null,2)}
  </script>
</body>
</html>`;
}

export async function startDashboard(port: number): Promise<void> {
  const runtime = new KagrraRuntime(createContext(), process.env.GEMINI_API_KEY);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const path = url.pathname;

    if (method === "GET" && path === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(htmlPage());
      return;
    }

    if (method === "GET" && path === "/api/doctor") {
      json(res, 200, await runtime.doctor());
      return;
    }

    if (method === "GET" && path === "/api/evidence") {
      json(res, 200, await runtime.evidence());
      return;
    }

    if (method === "POST" && path === "/api/run") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const parsed = body ? JSON.parse(body) as { task?: unknown } : {};
          json(res, 200, await runtime.run(String(parsed.task ?? "")));
        } catch (error) {
          json(res, 400, { error: error instanceof Error ? error.message : "Bad Request" });
        }
      });
      return;
    }

    json(res, 404, { error: "Not Found" });
  });

  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`KAGRRA dashboard listening on http://localhost:${port}`);
      resolve();
    });
  });
}
