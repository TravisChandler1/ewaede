import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
// import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';
import { addRenderIds } from './plugins/addRenderIds';
import { aliases } from './plugins/aliases';
import consoleToParent from './plugins/console-to-parent';
import { layoutWrapperPlugin } from './plugins/layouts';
import { loadFontsFromTailwindSource } from './plugins/loadFontsFromTailwindSource';
import { nextPublicProcessEnv } from './plugins/nextPublicProcessEnv';
import { restart } from './plugins/restart';
import { restartEnvFileChange } from './plugins/restartEnvFileChange';

// Force pure JavaScript rollup
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_PLATFORM = 'linux';
process.env.ROLLUP_ARCH = 'x64';

export default defineConfig({
  // Use VITE_ prefix for environment variables (required for Supabase)
  envPrefix: 'VITE_',
  optimizeDeps: {
    include: ['fast-glob', 'lucide-react'],
    exclude: [
      'fsevents',
      'lightningcss',
    ],
  },
  logLevel: 'info',
  plugins: [
    nextPublicProcessEnv(),
    restartEnvFileChange(),
    babel({
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: /node_modules/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: ['styled-jsx/babel'],
      },
    }),
    restart({
      restart: [
        'src/**/page.jsx',
        'src/**/page.tsx',
        'src/**/layout.jsx',
        'src/**/layout.tsx',
        'src/**/route.js',
        'src/**/route.ts',
      ],
    }),
    consoleToParent(),
    loadFontsFromTailwindSource(),
    addRenderIds(),
    reactRouter(),
    tsconfigPaths({
      ignoreConfigErrors: true,
      root: path.resolve(__dirname, 'src')
    }),
    aliases(),
    layoutWrapperPlugin(),
  ],
  resolve: {
    alias: {
      lodash: 'lodash-es',
      'npm:stripe': 'stripe',
      stripe: path.resolve(__dirname, './src/__create/stripe'),
      '@': path.resolve(__dirname, 'src'),
      // Force pure JavaScript rollup
      '@rollup/rollup-linux-x64-gnu': 'rollup',
      '@rollup/rollup-darwin-x64': 'rollup',
      '@rollup/rollup-win32-x64-msvc': 'rollup',
    },
    dedupe: ['react', 'react-dom'],
  },
  clearScreen: false,
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 4000,
    hmr: {
      overlay: false,
    },
    warmup: {
      clientFiles: ['./src/app/**/*', './src/app/root.tsx', './src/app/routes.ts'],
    },
  },
  build: {
    ssr: false,
    rollupOptions: {
      external: [
        '@neondatabase/serverless',
        '@supabase/supabase-js',
        'ws',
        'argon2',
        // Force external for platform-specific rollup binaries
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc'
      ],
      onwarn(warning, warn) {
        // Suppress rollup warnings about missing optional dependencies
        if (warning.code === 'MODULE_NOT_FOUND' && warning.message.includes('@rollup/rollup-')) {
          return;
        }
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('@rollup/rollup-')) {
          return;
        }
        warn(warning);
      }
    }
  }
});
