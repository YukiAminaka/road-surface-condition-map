import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const { GOOGLE_MAPS_API_KEY = "" } = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(GOOGLE_MAPS_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
