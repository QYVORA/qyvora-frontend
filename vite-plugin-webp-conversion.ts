import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import chokidar from 'chokidar';

interface WebpOptions {
  dirs?: string[];
  extensions?: string[];
  quality?: number;
}

export default function webpConversion(options: WebpOptions = {}): Plugin {
  const {
    dirs = ['public', 'src/assets'],
    extensions = ['.png', '.jpg', '.jpeg'],
    quality = 80,
  } = options;

  const convertImage = async (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!extensions.includes(ext)) return;

    const webpPath = filePath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');

    if (fs.existsSync(webpPath)) {
      const sourceStat = fs.statSync(filePath);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtime > sourceStat.mtime) {
        return;
      }
    }

    try {
      await sharp(filePath).webp({ quality }).toFile(webpPath);
      console.log(`[webp] Converted: ${path.relative(process.cwd(), filePath)}`);
    } catch (err) {
      console.error(`[webp] Error converting ${filePath}:`, err);
    }
  };

  const scanAndConvert = async (dir: string) => {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        await scanAndConvert(fullPath);
      } else {
        await convertImage(fullPath);
      }
    }
  };

  return {
    name: 'vite-plugin-webp-conversion',

    async buildStart() {
      for (const dir of dirs) {
        const fullDir = path.resolve(process.cwd(), dir);
        if (fs.existsSync(fullDir)) {
          await scanAndConvert(fullDir);
        }
      }
    },

    configureServer(server) {
      const watchers: chokidar.FSWatcher[] = [];

      for (const dir of dirs) {
        const fullDir = path.resolve(process.cwd(), dir);
        if (!fs.existsSync(fullDir)) continue;

        const watcher = chokidar.watch(fullDir, {
          ignored: /(^|[/\\])\../,
          persistent: true,
        });
        watcher.on('add', (p) => convertImage(p));
        watcher.on('change', (p) => convertImage(p));
        watchers.push(watcher);
      }

      server.httpServer?.on('close', () => {
        watchers.forEach((w) => w.close());
      });
    },
  };
}
