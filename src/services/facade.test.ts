import { appFacade } from "@/services/facade";
import { ApiError } from "@/services/api";
import {
  listPets,
  getPetById,
  createPet,
  updatePet,
} from "@/services/pets";
import { listTutores, getTutorById } from "@/services/tutores";

jest.mock("@/services/pets", () => ({
  listPets: jest.fn(),
  getPetById: jest.fn(),
  createPet: jest.fn(),
  updatePet: jest.fn(),
  addPetPhoto: jest.fn(),
  deletePet: jest.fn(),
}));

jest.mock("@/services/tutores", () => ({
  listTutores: jest.fn(),
  getTutorById: jest.fn(),
  createTutor: jest.fn(),
  updateTutor: jest.fn(),
  addTutorPhoto: jest.fn(),
  deleteTutor: jest.fn(),
  linkPetToTutor: jest.fn(),
  unlinkPetFromTutor: jest.fn(),
}));

describe("appFacade", () => {
  beforeEach(() => {
    appFacade.pets$.next([]);
    appFacade.petsState$.next({ loading: false, error: null, page: 0, totalPages: 0 });
    appFacade.selectedPet$.next(null);
    appFacade.petDetailState$.next({ loading: false, error: null });

    appFacade.tutores$.next([]);
    appFacade.tutoresState$.next({ loading: false, error: null, page: 0, totalPages: 0 });
    appFacade.selectedTutor$.next(null);
    appFacade.tutorDetailState$.next({ loading: false, error: null });

    (listPets as jest.Mock).mockReset();
    (getPetById as jest.Mock).mockReset();
    (createPet as jest.Mock).mockReset();
    (updatePet as jest.Mock).mockReset();
    (listTutores as jest.Mock).mockReset();
    (getTutorById as jest.Mock).mockReset();
  });

  it("loads pets and updates state", async () => {
    (listPets as jest.Mock).mockResolvedValue({
      content: [{ id: 1, nome: "Rex" }],
      pageCount: 3,
    });

    await appFacade.loadPets({ page: 1, size: 10 });

    expect(appFacade.pets$.getValue()).toHaveLength(1);
    expect(appFacade.petsState$.getValue()).toMatchObject({
      loading: false,
      error: null,
      page: 1,
      totalPages: 3,
    });
  });

  it("sets auth error message when list pets returns 401", async () => {
    (listPets as jest.Mock).mockRejectedValue(new ApiError("Unauthorized", 401));

    await expect(appFacade.loadPets({ page: 0, size: 10 })).rejects.toThrow(ApiError);

    expect(appFacade.petsState$.getValue().error).toContain("login");
  });

  it("loads pet details", async () => {
    (getPetById as jest.Mock).mockResolvedValue({ id: 1, nome: "Rex" });

    await appFacade.loadPetById(1);

    expect(appFacade.selectedPet$.getValue()?.id).toBe(1);
    expect(appFacade.petDetailState$.getValue().error).toBeNull();
  });

  it("creates pet and updates selected", async () => {
    (createPet as jest.Mock).mockResolvedValue({ id: 2, nome: "Luna" });

    await appFacade.createPet({ nome: "Luna", especie: "Gato" });

    expect(appFacade.selectedPet$.getValue()?.id).toBe(2);
  });

  it("loads tutores and updates state", async () => {
    (listTutores as jest.Mock).mockResolvedValue({
      content: [{ id: 7, nome: "Maria" }],
      pageCount: 2,
    });

    await appFacade.loadTutores({ page: 0, size: 10 });

    expect(appFacade.tutores$.getValue()).toHaveLength(1);
    expect(appFacade.tutoresState$.getValue()).toMatchObject({
      loading: false,
      error: null,
      page: 0,
      totalPages: 2,
    });
  });

  it("loads tutor details", async () => {
    (getTutorById as jest.Mock).mockResolvedValue({ id: 8, nome: "Joana" });

    await appFacade.loadTutorById(8);

    expect(appFacade.selectedTutor$.getValue()?.id).toBe(8);
    expect(appFacade.tutorDetailState$.getValue().error).toBeNull();
  });
});
