// Thin client-side fetch wrapper for the PSB Hono API. All calls are same-origin
// (/api/psb/*) and include cookies for session auth.

export class ApiError extends Error {
  status: number;
  issues?: Record<string, string[]>;
  constructor(message: string, status: number, issues?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function handle<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new ApiError(
      (data.error as string) ?? "Terjadi kesalahan",
      res.status,
      data.issues as Record<string, string[]> | undefined,
    );
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => fetch(path, { credentials: "include" }).then((r) => handle<T>(r)),
  post: <T>(path: string, body?: unknown) =>
    fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  patch: <T>(path: string, body?: unknown) =>
    fetch(path, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  put: <T>(path: string, body?: unknown) =>
    fetch(path, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  upload: <T>(path: string, form: FormData) =>
    fetch(path, { method: "POST", credentials: "include", body: form }).then((r) => handle<T>(r)),
};
