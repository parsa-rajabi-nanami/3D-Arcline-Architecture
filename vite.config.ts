import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env["NODE_ENV"] === "production" ? "/3D-Arcline-Architecture/" : "/",
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    nitro(),
    tailwindcss(),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
