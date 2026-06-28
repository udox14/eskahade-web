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

// Shared student DB (eskahade-db) — holds PSB registrant data (pendaftar tables).
export function getEskahadeDB(): D1Database {
  return getEnv().ESKAHADE_DB;
}

// R2 bucket for PSB registrant document uploads (berkas).
export function getPsbBucket(): R2Bucket {
  return getEnv().PSB_BUCKET;
}
