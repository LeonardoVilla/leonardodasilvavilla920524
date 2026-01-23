import { apiFetch } from "./api";

export async function login(username: string, password: string) {
  const data = await apiFetch("/autenticacao/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}
