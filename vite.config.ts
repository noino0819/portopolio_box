import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const define: Record<string, string> = {};
const supaUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supaKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (supaUrl) define['import.meta.env.VITE_SUPABASE_URL'] = JSON.stringify(supaUrl);
if (supaKey) define['import.meta.env.VITE_SUPABASE_ANON_KEY'] = JSON.stringify(supaKey);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define,
})
