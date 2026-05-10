import Constants from "expo-constants";

export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  message: string;
};

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  return extra?.apiBaseUrl?.replace(/\/$/, "") ?? "http://localhost:3001";
}

export async function apiGet<T>(
  path: string,
  headers?: Record<string, string>,
): Promise<ApiEnvelope<T>> {
  const base = resolveBaseUrl();
  const res = await fetch(`${base}${path}`, { headers });
  return (await res.json()) as ApiEnvelope<T>;
}

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<ApiEnvelope<T>> {
  const base = resolveBaseUrl();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as ApiEnvelope<T>;
}
