import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const sameOriginProxy: import("vite").ProxyOptions = {
  target: "http://127.0.0.1:8787",
  configure(proxy) {
    // Browser requests to the preview dashboard are same-origin. Strip the browser's
    // external Host origin when forwarding internally so the API's production CORS
    // allowlist isn't bypassed or misapplied to this dev-only server-side proxy.
    proxy.on("proxyReq", (proxyRequest) => proxyRequest.removeHeader("origin"));
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: { "/api": sameOriginProxy, "/health": sameOriginProxy },
  },
});
