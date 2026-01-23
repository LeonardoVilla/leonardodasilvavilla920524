export const storage = {
  isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  },

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem("token") : null;
  },

  setToken(token?: string) {
    if (!this.isBrowser() || !token) return;
    localStorage.setItem("token", token);
  },

  getRefreshToken(): string | null {
    return this.isBrowser() ? localStorage.getItem("refreshToken") : null;
  },

  setRefreshToken(token?: string) {
    if (!this.isBrowser() || !token) return;
    localStorage.setItem("refreshToken", token);
  },

  removeTokens() {
    if (!this.isBrowser()) return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};
