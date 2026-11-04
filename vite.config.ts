import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const certDir = path.resolve(__dirname, "certs");
const https =
  fs.existsSync(path.join(certDir, "lan.pem")) &&
    fs.existsSync(path.join(certDir, "lan-key.pem"))
    ? {
      cert: fs.readFileSync(path.join(certDir, "lan.pem")),
      key: fs.readFileSync(path.join(certDir, "lan-key.pem")),
    }
    : undefined;

export default defineConfig({
  base: "/synora/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    https,
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:3002",
        ws: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: false,
    css: true,
    clearMocks: true,
  },
});
