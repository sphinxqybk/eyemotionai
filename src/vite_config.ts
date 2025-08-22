import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/types': path.resolve(__dirname, './types'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/contexts': path.resolve(__dirname, './contexts'),
      '@/pages': path.resolve(__dirname, './pages'),
      '@/styles': path.resolve(__dirname, './styles'),

      // ✅ แก้ alias motion/react → framer-motion
      'motion/react': 'framer-motion',
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },

  // Development server
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion',      // ✅ ให้ Vite prebundle ด้วย
    ],
  },
});
