import { apiFetch } from "@/services/api";

export function useAuth() {
  async function refreshToken() {
    const data = await apiFetch("/autenticacao/refresh", {
      method: "PUT",
    });

    localStorage.setItem("token", data.token);
    return data;
  }

  return { refreshToken };
}