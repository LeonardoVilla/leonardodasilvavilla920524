import { useAuth } from "@/hooks/useAuth";
import { login, logout } from "@/services/auth";

jest.mock("@/services/auth", () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

describe("useAuth", () => {
  it("returns login and logout functions", () => {
    const auth = useAuth();

    expect(auth.login).toBe(login);
    expect(auth.logout).toBe(logout);
  });
});
