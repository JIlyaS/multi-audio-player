import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    server: {
      port: env.VITE_APP_PORT ? Number(env.VITE_APP_PORT) : 5173,
      // cors: {
      //   origin: "https://backend.multiaudioplayer.ru",
      // },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      // alias: {
      //   "@": path.resolve(__dirname, "./"),
      // },
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
        {
          find: "@components",
          replacement: path.resolve(__dirname, "src/components"),
        },
      ],
    },
    // build: {
    //   manifest: true,
    //   // rollupOptions: {
    //   //   // перезапись стандартной точки входа .html
    //   //   input: "/path/to/main.js",
    //   // },
    // },
  };
});
