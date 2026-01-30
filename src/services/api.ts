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
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const skipAuth = endpoint.startsWith("/autenticacao/login");
    const token = storage.getToken();
    if (!skipAuth && token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Remove leading slash from endpoint if base ends with slash
    const cleanEndpoint = base.endsWith("/") && endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    const response = await fetch(`${base}${cleanEndpoint}`, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        storage.removeTokens();
      }
      throw new ApiError(
        "Não foi possível comunicar com o servidor",
        response.status
      );
    }

    if (
      response.status === 204 ||
      response.status === 205 ||
      response.status === 304 ||
      options.method === "HEAD"
    ) {
      return undefined as T;
    }

    const rawText = await response.text();
    if (!rawText) {
      return undefined as T;
    }

    try {
      return JSON.parse(rawText) as T;
    } catch {
      // If response is not JSON, surface a generic error
      throw new ApiError("Invalid JSON response from server", response.status);
    }
  } catch (error) {
    // Se for um ApiError, relança com sua mensagem original
    if (error instanceof ApiError) {
      throw error;
    }
    // Para outros erros, loga e mostra mensagem genérica
    console.error("Erro de comunicação com a API:", error);
    throw new ApiError(
      "Servidor indisponível. Tente novamente mais tarde."
    );
  }
}
