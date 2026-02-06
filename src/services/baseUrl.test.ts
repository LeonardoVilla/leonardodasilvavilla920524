import { BASE_URL } from "@/services/baseUrl";

describe("baseUrl", () => {
  it("exposes the API base URL", () => {
    expect(BASE_URL).toBe("https://pet-manager-api.geia.vip");
  });
});
