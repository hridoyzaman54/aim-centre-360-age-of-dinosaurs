import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createRequestHandler } from 'react-router';

const app = new Hono();

// Catch-all: serve every request through React Router SSR
app.all('*', async (c) => {
  const build = await import('../build/server/assets/server-build.js');
  const handler = createRequestHandler(build, 'production');
  return handler(c.req.raw);
});

export default handle(app);
