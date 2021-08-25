import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: mode === 'production' ? '/meal-planner/' : '/',
    plugins: [svelte()],
  }
})
