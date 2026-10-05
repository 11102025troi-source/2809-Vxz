import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import apiRouter from './routes/api.js';
import pagesRouter from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public static assets
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
  app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
  app.use('/css', express.static(path.join(__dirname, 'css')));
  app.use('/js', express.static(path.join(__dirname, 'js')));

  // API router
  app.use('/api', apiRouter);

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Pages router (views)
  app.use('/', pagesRouter);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`👟 BlueStep Shoes Server running at http://localhost:${PORT}`);
  });
}

startServer();
