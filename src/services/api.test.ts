import { apiFetch, ApiError } from "@/services/api";

// Mock fetch
global.fetch = jest.fn();

describe("apiFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should make a successful API call", async () => {
    const mockData = { id: 1, nome: "Test Pet" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockData),
    });

    const result = await apiFetch("/v1/pets");
    expect(result).toEqual(mockData);
  });

  it("should throw ApiError on failed response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(apiFetch("/v1/pets/999")).rejects.toThrow(ApiError);
  });

  it("should add authorization header with token", async () => {
    localStorage.setItem("token", "test-token");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => "{}",
    });

    await apiFetch("/v1/pets");

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(callArgs[1].headers.get("Authorization")).toBe(
      "Bearer test-token"
    );
  });

  it("should handle JSON parsing errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "application/json" },
      text: async () => "{invalid-json}",
    });

    await expect(apiFetch("/v1/pets")).rejects.toThrow(ApiError);
  });

  it("should not throw on plain text success responses", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "text/plain" },
      text: async () => "Tutor removido com sucesso",
    });

    const result = await apiFetch<string>("/v1/tutores/1", { method: "DELETE" });
    expect(result).toBe("Tutor removido com sucesso");
  });
});
