import { defineConfig } from 'vite';
import path from 'node:path';
import glsl from 'vite-plugin-glsl';
import wasm from 'vite-plugin-wasm';


export default defineConfig({
  plugins: [ glsl() ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        javascript: path.resolve(__dirname, 'src/pages/js-physics-js-render/index.html'),
        wasm: path.resolve(__dirname, 'src/pages/wasm-physics-js-render/index.html'),
        webgl: path.resolve(__dirname, 'src/pages/js-physics-webgl-render/index.html'),
        wasmWebgl: path.resolve(__dirname, 'src/pages/wasm-physics-webgl-render/index.html'),
      }
    }
  },
  assetsInclude: ['**/*.wasm']
});