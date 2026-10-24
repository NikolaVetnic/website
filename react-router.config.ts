import type { Config } from "@react-router/dev/config";

export default {
  // No runtime server: the hosting only serves static files.
  ssr: false,
  // Render every static route to HTML at build time.
  prerender: true,
} satisfies Config;
