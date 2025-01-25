import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import fs from "fs";
import path from "path";

// Custom plugin to add "use client" directive
const useClientDirective = () => ({
  name: "use-client-directive",
  generateBundle(options, bundle) {
    Object.keys(bundle).forEach((id) => {
      const chunk = bundle[id];
      if (
        chunk.type === "chunk" &&
        (id.includes("client/") || id.includes("components/"))
      ) {
        chunk.code = `"use client";\n\n${chunk.code}`;

        // Update source map if it exists
        if (chunk.map) {
          chunk.map.mappings = ";" + chunk.map.mappings;
        }
      }
    });
  },
});

// Create a single bundle for client components
const clientConfig = {
  input: {
    "client/index": "src/client/index.ts",
    "client/hooks": "src/client/hooks.tsx",
    "client/analytics": "src/client/analytics.tsx",
    "client/provider": "src/client/provider.tsx",
    "components/server-analytics": "src/components/server-analytics.tsx",
  },
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
  },
  external: ["react"],
  plugins: [
    nodeResolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      moduleDirectories: ["node_modules"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
      exclude: ["node_modules", "dist"],
      noEmitOnError: true,
      sourceMap: true,
      include: ["src/client/**/*", "src/components/**/*"],
    }),
    babel({
      babelHelpers: "bundled",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      exclude: "node_modules/**",
    }),
    useClientDirective(),
  ],
};

// Server-only components
const serverConfig = {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
  },
  external: ["react"],
  plugins: [
    nodeResolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      moduleDirectories: ["node_modules"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
      exclude: ["node_modules", "dist"],
      noEmitOnError: true,
      sourceMap: true,
    }),
    babel({
      babelHelpers: "bundled",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      exclude: "node_modules/**",
    }),
  ],
};

export default [clientConfig, serverConfig];
