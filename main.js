const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = 8080;
const siteRoot = path.join(__dirname, "src", "site");

const contentTypes = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=UTF-8",
};

const server = http.createServer((req, res) => {
  const resourcePath = normalizePath(req.url || "/");
  const filePath = path.join(siteRoot, resourcePath);

  if (!filePath.startsWith(siteRoot)) {
    respondNotFound(res);
    return;
  }

  fs.readFile(filePath, (error, body) => {
    if (error) {
      respondNotFound(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(body);
  });
});

server.listen(port, () => {
  console.log(`Portfolio server is running at http://localhost:${port}/`);
});

function normalizePath(urlPath) {
  const pathname = new URL(urlPath, "http://localhost").pathname;

  if (pathname === "/") {
    return "index.html";
  }

  const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return cleanPath || "index.html";
}

function respondNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
  res.end("<h1>404</h1><p>Resource not found.</p>");
}
