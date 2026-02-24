const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  method: HttpMethod,
  body?: TBody,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
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

