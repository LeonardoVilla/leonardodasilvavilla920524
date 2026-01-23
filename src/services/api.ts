import { BASE_URL } from "./baseUrl";
import { storage } from "./storage";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? BASE_URL;
    // Ensure headers object exists and add Authorization when token available
    const headers = new Headers(options.headers as HeadersInit | undefined);
    const token = storage.getToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${base}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      throw new ApiError(
        "Não foi possível comunicar com o servidor",
        response.status
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      // If response is not JSON, surface a generic error
      throw new ApiError("Invalid JSON response from server", response.status);
    }
  } catch {
    // 🔇 evita erro feio no console do usuário
    console.warn("Erro de comunicação com a API");
    throw new ApiError(
      "Servidor indisponível. Tente novamente mais tarde."
    );
  }
}
