import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// 
export default defineConfig({
  plugins: [react()],
  // Removed proxy since we're making direct requests to backend
});
