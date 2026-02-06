import {
  addPetPhoto,
  createPet,
  deletePet,
  deletePetPhoto,
  listPets,
  updatePet,
} from "@/services/pets";
import { apiFetch, ApiError } from "@/services/api";
import type { PetRequestDto } from "@/types/api";

type ApiFetchMock = jest.MockedFunction<typeof apiFetch>;

jest.mock("@/services/api", () => {
  const actual = jest.requireActual("@/services/api");
  return {
    ...actual,
    apiFetch: jest.fn(),
  };
});

describe("pets service", () => {
  const apiFetchMock = apiFetch as ApiFetchMock;

  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("creates pet with full payload", async () => {
    const payload: PetRequestDto = {
      nome: "Rex",
      especie: "Cachorro",
      raca: "SRD",
      idade: 3,
    };
    apiFetchMock.mockResolvedValue({ id: 1, ...payload });

    await createPet(payload);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/pets",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("retries create without species on 400", async () => {
    const payload: PetRequestDto = {
      nome: "Rex",
      especie: "Cachorro",
      raca: "SRD",
      idade: 3,
    };
    apiFetchMock
      .mockRejectedValueOnce(new ApiError("Bad request", 400))
      .mockResolvedValueOnce({ id: 1, nome: "Rex", raca: "SRD", idade: 3 });

    await createPet(payload);

    expect(apiFetchMock).toHaveBeenCalledTimes(2);
    const secondCallBody = JSON.parse(
      (apiFetchMock.mock.calls[1][1] as RequestInit).body as string
    );
    expect(secondCallBody).toEqual({ nome: "Rex", raca: "SRD", idade: 3 });
  });

  it("lists pets with query params", async () => {
    apiFetchMock.mockResolvedValue({ content: [], pageCount: 1 });

    await listPets(1, 20, "Luna", "SRD");

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/pets?page=1&size=20&nome=Luna&raca=SRD"
    );
  });

  it("updates pet with retry when species is rejected", async () => {
    const payload: PetRequestDto = {
      nome: "Rex",
      especie: "Cachorro",
      raca: "SRD",
      idade: 3,
    };
    apiFetchMock
      .mockRejectedValueOnce(new ApiError("Bad request", 400))
      .mockResolvedValueOnce({ id: 1, nome: "Rex" });

    await updatePet(1, payload);

    expect(apiFetchMock).toHaveBeenCalledTimes(2);
  });

  it("confirms delete success when resource is gone", async () => {
    apiFetchMock
      .mockRejectedValueOnce(new ApiError("Server error", 500))
      .mockRejectedValueOnce(new ApiError("Not found", 404));

    await expect(deletePet(1)).resolves.toBeUndefined();
  });

  it("adds and removes pet photo", async () => {
    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    apiFetchMock.mockResolvedValueOnce({ id: 1, nome: "photo" });
    apiFetchMock.mockResolvedValueOnce(undefined);

    await addPetPhoto(1, file);
    await deletePetPhoto(1, 2);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/pets/1/fotos",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/pets/1/fotos/2",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
