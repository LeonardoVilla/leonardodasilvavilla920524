import { apiFetch } from "./api";
import { LoginResponse } from "@/types/api";
import { storage } from "./storage";

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

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}
