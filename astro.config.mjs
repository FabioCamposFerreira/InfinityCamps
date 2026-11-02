import { defineConfig } from 'astro/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const learnDir = path.join(root, 'Learn');
const apiTarget = process.env.API_URL || 'http://127.0.0.1:8787';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

function readCookie(header, name) {
  for (const part of String(header || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

// Valida o JWT (HS256) emitido pelo Worker. O segredo vem de workers/.dev.vars,
// repassado pelo scripts/dev.js ao processo do Astro.
function verifySession(token) {
  const secret = process.env.JWT_SECRET;
  const [header, payload, signature] = String(token || '').split('.');
  if (!secret || !header || !payload || !signature) return null;

  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest();
  const given = Buffer.from(signature, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (claims.exp && claims.exp < Date.now() / 1000) return null;
    if (claims.status !== 'approved' && claims.role !== 'admin') return null;
    return claims;
  } catch {
    return null;
  }
}

// Serve o conteúdo dos cursos (pasta Learn/) em /learn/*.
// Capas (cover.*) são públicas para o catálogo; o resto exige sessão aprovada.
function learnContent() {
  return {
    name: 'infinitycamps-learn-content',
    configureServer(server) {
      server.middlewares.use('/learn', (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();

        let relativePath;
        try {
          relativePath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        } catch {
          res.statusCode = 400;
          return res.end('Bad request');
        }

        const filePath = path.resolve(learnDir, `.${relativePath}`);
        if (filePath !== learnDir && !filePath.startsWith(learnDir + path.sep)) {
          res.statusCode = 403;
          return res.end('Forbidden');
        }

        let stats;
        try {
          stats = statSync(filePath);
        } catch {
          res.statusCode = 404;
          return res.end('Not found');
        }
        if (!stats.isFile()) {
          res.statusCode = 404;
          return res.end('Not found');
        }

        const isCover = /^cover\.[a-z0-9]+$/i.test(path.basename(filePath));
        if (!isCover && !verifySession(readCookie(req.headers.cookie, 'infinity_session'))) {
          const returnTo = encodeURIComponent(`/learn${relativePath}`);
          res.statusCode = 302;
          res.setHeader('Location', `/login?returnTo=${returnTo}`);
          return res.end();
        }

        res.setHeader('Content-Type', mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'HEAD') return res.end();
        createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  root: './',
  srcDir: './frontend/src',
  publicDir: './frontend/public',
  outDir: './frontend/dist',
  server: {
    port: 3000,
  },
  vite: {
    plugins: [learnContent()],
    server: {
      // O front chama /api/* no mesmo domínio. Em dev, as rotas do Worker (wrangler dev)
      // são encaminhadas; /api/courses.json é servido pelo próprio Astro (src/pages/api).
      proxy: {
        '^/api/(auth|admin|submissions|exercises|progress)': { target: apiTarget, changeOrigin: true },
      },
    },
  },
});
