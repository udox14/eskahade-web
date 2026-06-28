import { z } from "zod";
import { STEPS, ALL_FIELDS, type Field } from "@/lib/psb/fields";

// Build a Zod schema for one field per its config.
function fieldSchema(f: Field) {
  let base = z.string().trim();
  if (f.digits) {
    // exact digit length (when filled)
    base = base.regex(new RegExp(`^\\d{${f.digits}}$`), `Harus ${f.digits} digit angka`);
  }
  if (f.required) {
    return f.digits ? base.min(1, "Wajib diisi") : base.min(1, "Wajib diisi");
  }
  // optional: allow empty string
  return base.optional().or(z.literal(""));
}

// Per-step schema (client validation on "Lanjut").
export function stepSchema(stepIndex: number) {
  const fields = STEPS[stepIndex].fields.filter((f) => f.type !== "header" && f.type !== "file");
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

// Full server-side schema for POST /api/psb/pendaftaran.
export function fullSchema() {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of ALL_FIELDS) shape[f.name] = fieldSchema(f);
  return z.object(shape).passthrough();
}

export const loginSantriSchema = z.object({
  noReg: z.string().trim().min(1, "Nomor pendaftaran wajib diisi"),
  tanggalLahir: z.string().trim().min(1, "Tanggal lahir wajib diisi"),
});

export const loginAdminSchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
});
