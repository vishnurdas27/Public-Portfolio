import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    // a second copy of react in dev causes "Invalid hook call"
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["lucide-react", "react", "react-dom", "react-router"],
  },
});
