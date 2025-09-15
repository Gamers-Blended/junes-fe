import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - changes rarely, used everywhere
          vendor: ["react", "react-dom"],

          // State management - medium-sized, changes infrequently
          redux: ["@reduxjs/toolkit", "react-redux"],

          // Routing - medium-sized, changes infrequently
          router: ["react-router-dom"],

          // UI libraries - can be large
          carousel: ["react-slick", "slick-carousel"],

          // Utility libraries - small, separate concern
          utils: ["axios", "lucide-react"],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: { port: 4173 },
});
