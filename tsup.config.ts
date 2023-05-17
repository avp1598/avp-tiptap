import { defineConfig } from "tsup";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import { sassPlugin } from "esbuild-sass-plugin";

export default defineConfig({
  esbuildPlugins: [cssModulesPlugin(), sassPlugin()],
  splitting: true,
  minify: true,
  format: ["cjs", "esm"],
  injectStyle: true,
});
