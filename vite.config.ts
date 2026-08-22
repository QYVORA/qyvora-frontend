import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import webpConversion from './vite-plugin-webp-conversion';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    webpConversion(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      additionalPrerenderRoutes: [
        '/',
        '/hpb',
        '/hpb/phase1',
        '/hpb/phase2',
        '/hpb/phase3',
        '/hpb/phase4',
        '/hpb/phase5',
        '/services',
        '/services/basic-web-application-pentest',
        '/services/standard-web-application-pentest',
        '/services/employee-cybersecurity-bootcamp',
        '/blogs',
        '/courses',
        '/labs',
        '/zero-day-market',
        '/quiteroot',
        '/anansi',
        '/toha3ee',
        '/aksum',
        '/cp',
        '/team',
        '/leaderboard',
        '/leaderboard/all',
        '/terms',
        '/blogs/hpb-2026-cohort-case-study',
        '/blogs/hacker-protocol-bootcamp',
        '/blogs/anansi-cli',
        '/blogs/africa-cybersecurity-ecosystem',
        '/blogs/attackers-discover-companies',
        '/blogs/africa-needs-cybersecurity-professionals',
        '/blogs/mapping-attack-surfaces',
        '/blogs/future-cybersecurity-africa',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    // Raise the warning threshold — three.js is intentionally large
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps the initial bundle small
        manualChunks(id) {
          // Three.js in its own chunk — only loaded when HackerGlobe mounts
          if (id.includes('node_modules/three')) return 'three';

          // Animation library
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion';

          // GSAP — scroll/timeline animations
          if (id.includes('node_modules/gsap')) return 'gsap';

          // React core
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react';

          // Router
          if (id.includes('node_modules/react-router')) return 'router';

          // Radix UI
          if (id.includes('node_modules/@radix-ui')) return 'radix';

          // Axios
          if (id.includes('node_modules/axios')) return 'axios';

          // Recharts (pulls in redux, d3) — lazy-loaded by SkillRadarChart
          if (id.includes('node_modules/recharts') || id.includes('node_modules/@reduxjs') || id.includes('node_modules/d3')) return 'recharts';

          // Lucide icons — large icon set
          if (id.includes('node_modules/lucide-react')) return 'lucide';
        },
      },
    },

    // Minify with esbuild (default, fastest)
    minify: 'esbuild',

    // Generate source maps only in CI/staging — skip in prod for smaller output
    sourcemap: false,

    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',
  },

  server: {
    port: 5173,
    host: process.env.VITE_DEV_HOST || '127.0.0.1',
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
