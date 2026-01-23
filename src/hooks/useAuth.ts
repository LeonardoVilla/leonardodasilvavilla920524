import { login, logout } from "@/services/auth";

export function useAuth() {
  return {
    login,
    logout,
  };
}
