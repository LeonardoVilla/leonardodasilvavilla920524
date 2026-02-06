import { login, logout, refreshToken } from "@/services/auth";
import { apiFetch, ApiError } from "@/services/api";
import { storage } from "@/services/storage";

type ApiFetchMock = jest.MockedFunction<typeof apiFetch>;

jest.mock("@/services/api", () => {
  const actual = jest.requireActual("@/services/api");
  return {
    ...actual,
    apiFetch: jest.fn(),
  };
});

jest.mock("@/services/storage", () => ({
  storage: {
    getRefreshToken: jest.fn(),
    setToken: jest.fn(),
    setRefreshToken: jest.fn(),
    removeToken: jest.fn(),
    removeRefreshToken: jest.fn(),
  },
}));

describe("auth service", () => {
  const apiFetchMock = apiFetch as ApiFetchMock;

  beforeEach(() => {
    apiFetchMock.mockReset();
    (storage.getRefreshToken as jest.Mock).mockReset();
    (storage.setToken as jest.Mock).mockReset();
    (storage.setRefreshToken as jest.Mock).mockReset();
    (storage.removeToken as jest.Mock).mockReset();
    (storage.removeRefreshToken as jest.Mock).mockReset();
    document.cookie = "";
  });

  it("stores tokens and sets auth cookie on login", async () => {
    apiFetchMock.mockResolvedValue({
      access_token: "access",
      refresh_token: "refresh",
    });

    await login("admin", "admin");

    expect(storage.setToken).toHaveBeenCalledWith("access");
    expect(storage.setRefreshToken).toHaveBeenCalledWith("refresh");
    expect(document.cookie).toContain("pm_auth=1");
  });

  it("throws when refresh token is missing", async () => {
    (storage.getRefreshToken as jest.Mock).mockReturnValue(null);

    await expect(refreshToken()).rejects.toThrow(ApiError);
    await expect(refreshToken()).rejects.toMatchObject({ status: 401 });
  });

  it("refreshes tokens and stores new values", async () => {
    (storage.getRefreshToken as jest.Mock).mockReturnValue("refresh");
    apiFetchMock.mockResolvedValue({
      access_token: "new-access",
      refresh_token: "new-refresh",
    });

    await refreshToken();

    expect(storage.setToken).toHaveBeenCalledWith("new-access");
    expect(storage.setRefreshToken).toHaveBeenCalledWith("new-refresh");
  });

  it("clears tokens on logout", () => {
    logout();

    expect(storage.removeToken).toHaveBeenCalledTimes(1);
    expect(storage.removeRefreshToken).toHaveBeenCalledTimes(1);
  });
});
