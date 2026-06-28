// Client helpers for the cascading wilayah dropdowns. They call our own Hono
// proxy (which forwards to Emsifa) so the browser never hits a third party
// directly and we can cache later if needed.

export type Region = { id: string; name: string };

async function get(url: string): Promise<Region[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()) as Region[];
}

export const fetchProvinsi = () => get("/api/psb/wilayah/provinsi");
export const fetchKabupaten = (provinsiId: string) =>
  get(`/api/psb/wilayah/kabupaten?provinsi=${encodeURIComponent(provinsiId)}`);
export const fetchKecamatan = (kabupatenId: string) =>
  get(`/api/psb/wilayah/kecamatan?kabupaten=${encodeURIComponent(kabupatenId)}`);
export const fetchDesa = (kecamatanId: string) =>
  get(`/api/psb/wilayah/desa?kecamatan=${encodeURIComponent(kecamatanId)}`);
