import { storage } from "@/services/storage";

describe("storage", () => {
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;
  let removeItemSpy: jest.SpyInstance;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => undefined);
    removeItemSpy = jest
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  it("detects browser environment", () => {
    expect(storage.isBrowser()).toBe(true);
  });

  it("reads and writes tokens", () => {
    getItemSpy.mockReturnValue("token-1");

    expect(storage.getToken()).toBe("token-1");

    storage.setToken("token-2");
    expect(setItemSpy).toHaveBeenCalledWith("token", "token-2");

    storage.removeToken();
    expect(removeItemSpy).toHaveBeenCalledWith("token");
  });

  it("manages refresh token", () => {
    getItemSpy.mockReturnValue("refresh-1");

    expect(storage.getRefreshToken()).toBe("refresh-1");

    storage.setRefreshToken("refresh-2");
    expect(setItemSpy).toHaveBeenCalledWith("refreshToken", "refresh-2");

    storage.removeRefreshToken();
    expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
  });

  it("removes both tokens", () => {
    storage.removeTokens();

    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
  });
});
