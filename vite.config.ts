import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");
  const isAnalyze = process.env.ANALYZE === "true";
  const isProduction = mode === "production";

  return {
    base: "./",

    // Плагины
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
      checker({
        typescript: true,
        // eslint: {
        //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        // },
      }),
      isAnalyze &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: "dist/stats.html",
        }),
    ].filter(Boolean),

    // Настройки dev-сервера
    server: {
      port: env.VITE_APP_PORT ? Number(env.VITE_APP_PORT) : 5173,
      open: true,
    },

    // Настройки сборки
    build: {
      outDir: "dist",
      assetsDir: "assets",
      minify: isProduction ? "terser" : false,
      target: "es2015",
      sourcemap: !isProduction,
      cssCodeSplit: true,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },

    css: {
      devSourcemap: true,
    },

    // Разрешение модулей
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(import.meta.dirname, "src"),
        },
        {
          find: "@components",
          replacement: path.resolve(import.meta.dirname, "src/components"),
        },
        // '@components': path.resolve(__dirname, './src/components'),
      ],
    },

    // // Переменные CSS
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "@/styles/variables.scss";`,
    //     },
    //   },
    // },
  };
});
