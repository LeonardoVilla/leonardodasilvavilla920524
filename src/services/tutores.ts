import { apiFetch } from "./api";
import {
    ProprietarioRequestDto,
    ProprietarioResponseDto,
    ProprietarioResponseComPetsDto,
    PagedProprietarioResponseDto,
    AnexoResponseDto,
} from "@/types/api";

// ===== OPERAÇÕES CRUD =====

export async function createTutor(
    data: ProprietarioRequestDto
): Promise<ProprietarioResponseDto> {
    return apiFetch<ProprietarioResponseDto>("/v1/tutores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function listTutores(
    page: number = 0,
    size: number = 10,
    nome?: string
): Promise<PagedProprietarioResponseDto> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (nome) params.append("nome", nome);

    return apiFetch<PagedProprietarioResponseDto>(
        `/v1/tutores?${params.toString()}`
    );
}

export async function getTutorById(id: number): Promise<ProprietarioResponseComPetsDto> {
    return apiFetch<ProprietarioResponseComPetsDto>(`/v1/tutores/${id}`);
}

export async function updateTutor(
    id: number,
    data: ProprietarioRequestDto
): Promise<ProprietarioResponseDto> {
    return apiFetch<ProprietarioResponseDto>(`/v1/tutores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteTutor(id: number): Promise<void> {
    await apiFetch<void>(`/v1/tutores/${id}`, {
        method: "DELETE",
    });
}

// ===== OPERAÇÕES COM FOTOS =====

export async function addTutorPhoto(
    tutorId: number,
    file: File
): Promise<AnexoResponseDto> {
    const formData = new FormData();
    formData.append("foto", file);

    return apiFetch<AnexoResponseDto>(`/v1/tutores/${tutorId}/fotos`, {
        method: "POST",
        body: formData,
    });
}

export async function deleteTutorPhoto(
    tutorId: number,
    fotoId: number
): Promise<void> {
    await apiFetch<void>(`/v1/tutores/${tutorId}/fotos/${fotoId}`, {
        method: "DELETE",
    });
}

// ===== OPERAÇÕES COM VÍNCULO PET-TUTOR =====

export async function linkPetToTutor(
    tutorId: number,
    petId: number
): Promise<void> {
    await apiFetch<void>(`/v1/tutores/${tutorId}/pets/${petId}`, {
        method: "POST",
    });
}

export async function unlinkPetFromTutor(
    tutorId: number,
    petId: number
): Promise<void> {
    await apiFetch<void>(`/v1/tutores/${tutorId}/pets/${petId}`, {
        method: "DELETE",
    });
}
