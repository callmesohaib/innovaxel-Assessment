import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: [
      "5c37-182-185-183-211.ngrok-free.app", // Your ngrok URL
      "localhost", // Keep localhost access
    ],
    headers: {
      "ngrok-skip-browser-warning": "any-value", // Also skip the ngrok warning
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
