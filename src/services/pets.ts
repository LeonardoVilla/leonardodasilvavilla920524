import { apiFetch, ApiError } from "./api";
import {
    PetRequestDto,
    PetResponseDto,
    PetResponseCompletoDto,
    PagedPetResponseDto,
    AnexoResponseDto,
} from "@/types/api";

type PetRequestLegacyDto = Omit<PetRequestDto, "especie">;

// ===== OPERAÇÕES CRUD =====

export async function createPet(data: PetRequestDto): Promise<PetResponseDto> {
    try {
        return await apiFetch<PetResponseDto>("/v1/pets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (error) {
        // Backward compatibility: if API doesn't accept the new field, retry without it.
        if (error instanceof ApiError && error.status === 400) {
            const legacyPayload: PetRequestLegacyDto = {
                nome: data.nome,
                raca: data.raca,
                idade: data.idade,
            };
            return apiFetch<PetResponseDto>("/v1/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(legacyPayload),
            });
        }
        throw error;
    }
}

export async function listPets(
    page: number = 0,
    size: number = 10,
    nome?: string,
    raca?: string
): Promise<PagedPetResponseDto> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (nome) params.append("nome", nome);
    if (raca) params.append("raca", raca);

    return apiFetch<PagedPetResponseDto>(`/v1/pets?${params.toString()}`);
}

export async function getPetById(id: number): Promise<PetResponseCompletoDto> {
    return apiFetch<PetResponseCompletoDto>(`/v1/pets/${id}`);
}

export async function updatePet(
    id: number,
    data: PetRequestDto
): Promise<PetResponseDto> {
    try {
        return await apiFetch<PetResponseDto>(`/v1/pets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (error) {
        // Backward compatibility: if API doesn't accept the new field, retry without it.
        if (error instanceof ApiError && error.status === 400) {
            const legacyPayload: PetRequestLegacyDto = {
                nome: data.nome,
                raca: data.raca,
                idade: data.idade,
            };
            return apiFetch<PetResponseDto>(`/v1/pets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(legacyPayload),
            });
        }
        throw error;
    }
}

export async function deletePet(id: number): Promise<void> {
    try {
        await apiFetch<void>(`/v1/pets/${id}`, {
            method: "DELETE",
        });
        return;
    } catch (error) {
        // If the backend deleted but returned an error (or the client saw a network error),
        // confirm whether the resource is gone; if so, treat as success.
        try {
            await getPetById(id);
        } catch (verifyError) {
            if (verifyError instanceof ApiError && verifyError.status === 404) {
                return;
            }
        }
        throw error;
    }
}

// ===== OPERAÇÕES COM FOTOS =====

export async function addPetPhoto(
    petId: number,
    file: File
): Promise<AnexoResponseDto> {
    const formData = new FormData();
    formData.append("foto", file);

    return apiFetch<AnexoResponseDto>(`/v1/pets/${petId}/fotos`, {
        method: "POST",
        body: formData,
    });
}

export async function deletePetPhoto(
    petId: number,
    fotoId: number
): Promise<void> {
    await apiFetch<void>(`/v1/pets/${petId}/fotos/${fotoId}`, {
        method: "DELETE",
    });
}
