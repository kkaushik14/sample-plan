import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname);
const port = Number.parseInt(process.env.PORT || "5173", 10);
const host = process.env.HOST || "127.0.0.1";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(message);
}

function resolveRequestPath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const normalizedPath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const relativePath = normalizedPath === sep ? "apps/web/index.html" : normalizedPath.replace(/^[/\\]/, "");
  const absolutePath = resolve(join(rootDir, relativePath));

  if (!absolutePath.startsWith(rootDir + sep) && absolutePath !== rootDir) {
    return null;
  }

  return absolutePath;
}

async function serveStatic(request, response, pathname) {
  const requestedPath = resolveRequestPath(pathname);

  if (!requestedPath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  let filePath = requestedPath;
  let fileStat;

  try {
    fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStat = await stat(filePath);
    }
  } catch {
    sendText(response, 404, "Not found");
    return;
  }

  if (!fileStat.isFile()) {
    sendText(response, 404, "Not found");
    return;
  }

  const contentType = contentTypes[extname(filePath)] || "application/octet-stream";
  response.writeHead(200, {
    "content-type": contentType,
    "content-length": fileStat.size,
    "cache-control": "no-store"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    sendJson(response, 405, { success: false, error: "Method not allowed" });
    return;
  }

  const url = new URL(request.url || "/", `http://${request.headers.host || `${host}:${port}`}`);

  if (url.pathname === "/health") {
    sendJson(response, 200, {
      success: true,
      service: "sahara-node-server",
      status: "ok"
    });
    return;
  }

  if (url.pathname === "/api/public/portfolio/home") {
    await serveStatic(request, response, "/data/portfolio.seed.json");
    return;
  }

  await serveStatic(request, response, url.pathname);
});

server.listen(port, host, () => {
  console.log(`Sahara Node server running at http://${host}:${port}/apps/web/`);
});
