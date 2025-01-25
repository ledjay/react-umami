import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import type { Plugin } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react",
    }),
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "client/index": resolve(__dirname, "src/client/index.ts"),
        "client/hooks": resolve(__dirname, "src/client/hooks.tsx"),
        "client/analytics": resolve(__dirname, "src/client/analytics.tsx"),
        "client/provider": resolve(__dirname, "src/client/provider.tsx"),
        "components/server-analytics": resolve(
          __dirname,
          "src/components/server-analytics.tsx"
        ),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        banner: (chunk) => {
          if (
            chunk.fileName.includes("client/") ||
            chunk.fileName.includes("components/")
          ) {
            return '"use client";\n';
          }
          return "";
        },
        exports: "named",
        interop: "compat",
        generatedCode: {
          constBindings: true,
        },
      },
    },
    target: "esnext",
    sourcemap: true,
    minify: false,
  },
});
