import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are served from R2 via our own /api/media route, so no remote loader needed.
  images: { unoptimized: true },
};

export default nextConfig;

// Enable Cloudflare bindings (D1, R2) during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
