import {
  createTutor,
  deleteTutor,
  listTutores,
  linkPetToTutor,
  unlinkPetFromTutor,
  addTutorPhoto,
  deleteTutorPhoto,
} from "@/services/tutores";
import { apiFetch, ApiError } from "@/services/api";
import type { ProprietarioRequestDto } from "@/types/api";

type ApiFetchMock = jest.MockedFunction<typeof apiFetch>;

jest.mock("@/services/api", () => {
  const actual = jest.requireActual("@/services/api");
  return {
    ...actual,
    apiFetch: jest.fn(),
  };
});

describe("tutores service", () => {
  const apiFetchMock = apiFetch as ApiFetchMock;

  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("creates tutor", async () => {
    const payload: ProprietarioRequestDto = {
      nome: "Maria",
      telefone: "11999999999",
      email: "maria@example.com",
      endereco: "Rua 1",
    };
    apiFetchMock.mockResolvedValue({ id: 1, ...payload });

    await createTutor(payload);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/tutores",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("lists tutores with query params", async () => {
    apiFetchMock.mockResolvedValue({ content: [], pageCount: 1 });

    await listTutores(2, 5, "Ana");

    expect(apiFetchMock).toHaveBeenCalledWith("/v1/tutores?page=2&size=5&nome=Ana");
  });

  it("treats delete as success when backend already removed", async () => {
    apiFetchMock
      .mockRejectedValueOnce(new ApiError("Bad request", 400))
      .mockRejectedValueOnce(new ApiError("Not found", 404));

    await expect(deleteTutor(1)).resolves.toBeUndefined();
  });

  it("links and unlinks pets", async () => {
    apiFetchMock.mockResolvedValue(undefined);

    await linkPetToTutor(1, 2);
    await unlinkPetFromTutor(1, 2);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/tutores/1/pets/2",
      expect.objectContaining({ method: "POST" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/tutores/1/pets/2",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("adds and removes tutor photo", async () => {
    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    apiFetchMock.mockResolvedValueOnce({ id: 1, nome: "photo" });
    apiFetchMock.mockResolvedValueOnce(undefined);

    await addTutorPhoto(1, file);
    await deleteTutorPhoto(1, 2);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/tutores/1/fotos",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/v1/tutores/1/fotos/2",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
