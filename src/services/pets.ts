import { apiFetch } from "./api";
import {
    PetRequestDto,
    PetResponseDto,
    PetResponseCompletoDto,
    PagedPetResponseDto,
    AnexoResponseDto,
} from "@/types/api";

// ===== OPERAÇÕES CRUD =====

export async function createPet(data: PetRequestDto): Promise<PetResponseDto> {
    return apiFetch<PetResponseDto>("/v1/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
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
    return apiFetch<PetResponseDto>(`/v1/pets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deletePet(id: number): Promise<void> {
    await apiFetch<void>(`/v1/pets/${id}`, {
        method: "DELETE",
    });
}

// ===== OPERAÇÕES COM FOTOS =====

export async function addPetPhoto(
    petId: number,
    file: File
): Promise<AnexoResponseDto> {
    const formData = new FormData();
    formData.append("foto", file);

    // Need custom fetch to avoid setting Content-Type header for FormData
    const response = await fetch(`/v1/pets/${petId}/fotos`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Falha ao fazer upload da foto do pet");
    }

    return response.json();
}

export async function deletePetPhoto(
    petId: number,
    fotoId: number
): Promise<void> {
    await apiFetch<void>(`/v1/pets/${petId}/fotos/${fotoId}`, {
        method: "DELETE",
    });
}
