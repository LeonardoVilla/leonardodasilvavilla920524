import { apiFetch, ApiError } from "./api";
import { AuthResponseDto } from "@/types/api";
import { storage } from "./storage";

export type LoginResponse = AuthResponseDto;

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/autenticacao/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (data.access_token) {
    storage.setToken(String(data.access_token));
  }

  if (data.refresh_token) {
    storage.setRefreshToken(String(data.refresh_token));
  }

  return data;
}

export async function refreshToken(): Promise<LoginResponse> {
  const refreshToken = storage.getRefreshToken();

  if (!refreshToken) {
    throw new ApiError("Refresh token not available", 401);
  }

  const data = await apiFetch<LoginResponse>("/autenticacao/refresh", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (data.access_token) {
    storage.setToken(String(data.access_token));
  }

  if (data.refresh_token) {
    storage.setRefreshToken(String(data.refresh_token));
  }

  return data;
}

export function logout() {
  storage.removeToken();
  storage.removeRefreshToken();
}
