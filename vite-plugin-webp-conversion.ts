import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import chokidar from 'chokidar';

interface WebpOptions {
  publicDir?: string;
  extensions?: string[];
  quality?: number;
  autoReplace?: boolean; // If true, will serve .webp instead of .png/.jpg in dev/build
}

export default function webpConversion(options: WebpOptions = {}): Plugin {
  const {
    publicDir = 'public',
    extensions = ['.png', '.jpg', '.jpeg'],
    quality = 80,
    autoReplace = true,
  } = options;

  const convertImage = async (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!extensions.includes(ext)) return;

    const webpPath = filePath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
    
    // Skip if webp already exists and is newer than source
    if (fs.existsSync(webpPath)) {
      const sourceStat = fs.statSync(filePath);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtime > sourceStat.mtime) {
        return;
      }
    }

    try {
      await sharp(filePath)
        .webp({ quality })
        .toFile(webpPath);
      console.log(`[webp-conversion] Converted: ${path.relative(process.cwd(), filePath)} -> ${path.relative(process.cwd(), webpPath)}`);
    } catch (err) {
      console.error(`[webp-conversion] Error converting ${filePath}:`, err);
    }
  };

  const scanAndConvert = async (dir: string) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        await scanAndConvert(fullPath);
      } else {
        await convertImage(fullPath);
      }
    }
  };

  return {
    name: 'vite-plugin-webp-conversion',
    
    // Convert all images on build start
    async buildStart() {
      const fullPublicDir = path.resolve(process.cwd(), publicDir);
      if (fs.existsSync(fullPublicDir)) {
        await scanAndConvert(fullPublicDir);
      }
    },

    // Handle dev server
    configureServer(server) {
      const fullPublicDir = path.resolve(process.cwd(), publicDir);
      
      // 1. Watch for new files
      const watcher = chokidar.watch(fullPublicDir, {
        ignored: /(^|[/\\])\../,
        persistent: true,
      });

      watcher.on('add', (filePath) => convertImage(filePath));
      watcher.on('change', (filePath) => convertImage(filePath));

      server.httpServer?.on('close', () => {
        watcher.close();
      });

      // 2. Intercept requests (if autoReplace is on)
      if (autoReplace) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          
          const url = new URL(req.url, 'http://localhost');
          const ext = path.extname(url.pathname).toLowerCase();
          
          if (extensions.includes(ext)) {
            const webpPath = url.pathname.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
            const fullWebpPath = path.join(fullPublicDir, webpPath);
            
            if (fs.existsSync(fullWebpPath)) {
              // Redirect or serve the webp file
              // For simplicity in dev, we just rewrite the URL internally
              req.url = webpPath;
            }
          }
          next();
        });
      }
    },

    // Handle build-time replacement
    transform(code, id) {
      if (!autoReplace) return;
      if (id.includes('node_modules')) return;
      if (!id.match(/\.(tsx|ts|jsx|js|css|html)$/)) return;
      
      // Replace image extensions in strings in the source code during build
      // only if they are preceded by path or filename characters.
      let newCode = code;
      for (const ext of extensions) {
        const regex = new RegExp(`([\\w\\/\\.\\-]+)\\${ext}(?=["'\\s])`, 'g');
        newCode = newCode.replace(regex, '$1.webp');
      }
      return {
        code: newCode,
        map: null
      };
    }
  };
}
