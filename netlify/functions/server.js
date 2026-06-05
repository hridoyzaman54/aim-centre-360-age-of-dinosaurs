import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';

const app = new Hono();

app.all('*', async (c) => {
  // Import the React Router SSR bundle
  const build = await import('../../build/server/assets/server-build.js');
  const handler = createRequestHandler(build, 'production');
  return handler(c.req.raw);
});

// Netlify Edge / standard functions v2 handle standard Requests
export default async (req) => {
  return app.fetch(req);
};

export const config = {
  path: '/*'
};
