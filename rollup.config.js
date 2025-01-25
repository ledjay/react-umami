import typescript from "@rollup/plugin-typescript";

// Use triple quotes to avoid string escaping issues
const banner = `'use client';`;

const createConfig = (input, output, useClientBanner = false) => ({
  input,
  output: [
    {
      file: `dist/${output}.js`,
      format: "cjs",
      sourcemap: true,
      exports: "named",
      ...(useClientBanner ? { banner } : {}),
    },
    {
      file: `dist/${output}.esm.js`,
      format: "esm",
      sourcemap: true,
      exports: "named",
      ...(useClientBanner ? { banner } : {}),
    },
  ],
  external: ["react"],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
    }),
  ],
});

export default [
  createConfig("src/index.ts", "index"),
  createConfig("src/client.tsx", "client", true),
];
