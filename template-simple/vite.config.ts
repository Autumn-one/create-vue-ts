import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig( {
    plugins: [
        vue(),
        AutoImport({
            dts: "src/typing/auto-import.d.ts",
            imports: ["vue"],
            dirs: [
                "./src/stores", "./src/utils"
            ]
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath( new URL( "./src", import.meta.url ) )
        }
    },
} );
