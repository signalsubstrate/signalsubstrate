import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://signalsubstrate.github.io',
  output: 'static',
  server: {
    port: 3000,
    host: true,
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
  vite: {
    plugins: [
      {
        name: 'viz-subdir-index',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url && req.url.startsWith('/viz/') && req.url.endsWith('/')) {
              req.url = `${req.url}index.html`;
            }
            next();
          });
        },
      },
    ],
  },
});
