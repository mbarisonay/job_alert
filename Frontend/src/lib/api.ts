const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const { token } = JSON.parse(raw) as { token: string };
    return token ?? null;
  } catch {
    return null;
  }
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  method: HttpMethod,
  body?: TBody,
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: TResponse;
  };

  if (!res.ok) {
    throw new Error(data.message || "İstek sırasında bir hata oluştu.");
  }

  return (data.data ?? (data as unknown)) as TResponse;
}
