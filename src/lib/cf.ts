import { getCloudflareContext } from "@opennextjs/cloudflare";

// Access Cloudflare bindings (D1 `DB`, R2 `BUCKET`, vars) from server code.
export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

export function getDB(): D1Database {
  return getEnv().DB;
}

export function getBucket(): R2Bucket {
  return getEnv().BUCKET;
}
