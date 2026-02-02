import { BehaviorSubject } from "rxjs";
import {
    PetRequestDto,
    PetResponseCompletoDto,
    PetResponseDto,
    PagedPetResponseDto,
    ProprietarioRequestDto,
    ProprietarioResponseComPetsDto,
    ProprietarioResponseDto,
    PagedProprietarioResponseDto,
    AnexoResponseDto,
} from "@/types/api";
import {
    addPetPhoto,
    createPet,
    deletePet,
    getPetById,
    listPets,
    updatePet,
} from "@/services/pets";
import {
    addTutorPhoto,
    createTutor,
    deleteTutor,
    getTutorById,
    linkPetToTutor,
    listTutores,
    unlinkPetFromTutor,
    updateTutor,
} from "@/services/tutores";

export type ListState = {
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
};

export type DetailState = {
    loading: boolean;
    error: string | null;
};

class AppFacade {
    pets$ = new BehaviorSubject<PetResponseDto[]>([]);
    petsState$ = new BehaviorSubject<ListState>({
        loading: false,
        error: null,
        page: 0,
        totalPages: 0,
    });
    selectedPet$ = new BehaviorSubject<PetResponseCompletoDto | null>(null);
    petDetailState$ = new BehaviorSubject<DetailState>({ loading: false, error: null });

    tutores$ = new BehaviorSubject<ProprietarioResponseDto[]>([]);
    tutoresState$ = new BehaviorSubject<ListState>({
        loading: false,
        error: null,
        page: 0,
        totalPages: 0,
    });
    selectedTutor$ = new BehaviorSubject<ProprietarioResponseComPetsDto | null>(null);
    tutorDetailState$ = new BehaviorSubject<DetailState>({ loading: false, error: null });

    async loadPets(params: {
        page: number;
        size: number;
        nome?: string;
        raca?: string;
    }): Promise<PagedPetResponseDto> {
        const prev = this.petsState$.getValue();
        this.petsState$.next({ ...prev, loading: true, error: null, page: params.page });

        try {
            const data = await listPets(params.page, params.size, params.nome, params.raca);
            this.pets$.next(Array.isArray(data.content) ? data.content : []);
            this.petsState$.next({
                loading: false,
                error: null,
                page: params.page,
                totalPages: data.pageCount || 1,
            });
            return data;
        } catch (error) {
            this.pets$.next([]);
            this.petsState$.next({
                loading: false,
                error: "Não foi possível carregar os pets. Tente novamente.",
                page: params.page,
                totalPages: 0,
            });
            throw error;
        }
    }

    async loadPetById(petId: number | string): Promise<PetResponseCompletoDto> {
        this.petDetailState$.next({ loading: true, error: null });
        try {
            const data = await getPetById(Number(petId));
            this.selectedPet$.next(data);
            this.petDetailState$.next({ loading: false, error: null });
            return data;
        } catch (error) {
            this.petDetailState$.next({ loading: false, error: "Pet não encontrado" });
            throw error;
        }
    }

    clearSelectedPet() {
        this.selectedPet$.next(null);
        this.petDetailState$.next({ loading: false, error: null });
    }

    async createPet(data: PetRequestDto): Promise<PetResponseDto> {
        const result = await createPet(data);
        this.selectedPet$.next(result as unknown as PetResponseCompletoDto);
        return result;
    }

    async updatePet(id: number, data: PetRequestDto): Promise<PetResponseDto> {
        const result = await updatePet(id, data);
        const current = this.selectedPet$.getValue();
        this.selectedPet$.next(current ? ({ ...current, ...result } as PetResponseCompletoDto) : (result as unknown as PetResponseCompletoDto));
        return result;
    }

    async addPetPhoto(petId: number, file: File): Promise<AnexoResponseDto> {
        const foto = await addPetPhoto(petId, file);
        const current = this.selectedPet$.getValue();
        if (current?.id === petId) {
            this.selectedPet$.next({ ...current, foto });
        }
        return foto;
    }

    async deletePet(petId: number): Promise<void> {
        await deletePet(petId);
        const current = this.selectedPet$.getValue();
        if (current?.id === petId) {
            this.selectedPet$.next(null);
        }
    }

    async loadTutores(params: { page: number; size: number; nome?: string }): Promise<PagedProprietarioResponseDto> {
        const prev = this.tutoresState$.getValue();
        this.tutoresState$.next({ ...prev, loading: true, error: null, page: params.page });

        try {
            const data = await listTutores(params.page, params.size, params.nome);
            this.tutores$.next(Array.isArray(data.content) ? data.content : []);
            this.tutoresState$.next({
                loading: false,
                error: null,
                page: params.page,
                totalPages: data.pageCount || 1,
            });
            return data;
        } catch (error) {
            this.tutores$.next([]);
            this.tutoresState$.next({
                loading: false,
                error: "Não foi possível carregar os tutores. Tente novamente.",
                page: params.page,
                totalPages: 0,
            });
            throw error;
        }
    }

    async loadTutorById(tutorId: number | string): Promise<ProprietarioResponseComPetsDto> {
        this.tutorDetailState$.next({ loading: true, error: null });
        try {
            const data = await getTutorById(Number(tutorId));
            this.selectedTutor$.next(data);
            this.tutorDetailState$.next({ loading: false, error: null });
            return data;
        } catch (error) {
            this.tutorDetailState$.next({ loading: false, error: "Tutor não encontrado" });
            throw error;
        }
    }

    clearSelectedTutor() {
        this.selectedTutor$.next(null);
        this.tutorDetailState$.next({ loading: false, error: null });
    }

    async createTutor(data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
        const result = await createTutor(data);
        this.selectedTutor$.next(result as unknown as ProprietarioResponseComPetsDto);
        return result;
    }

    async updateTutor(id: number, data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
        const result = await updateTutor(id, data);
        const current = this.selectedTutor$.getValue();
        this.selectedTutor$.next(current ? ({ ...current, ...result } as ProprietarioResponseComPetsDto) : (result as unknown as ProprietarioResponseComPetsDto));
        return result;
    }

    async addTutorPhoto(tutorId: number, file: File): Promise<AnexoResponseDto> {
        const foto = await addTutorPhoto(tutorId, file);
        const current = this.selectedTutor$.getValue();
        if (current?.id === tutorId) {
            this.selectedTutor$.next({ ...current, foto });
        }
        return foto;
    }

    async deleteTutor(tutorId: number): Promise<void> {
        await deleteTutor(tutorId);
        const current = this.selectedTutor$.getValue();
        if (current?.id === tutorId) {
            this.selectedTutor$.next(null);
        }
    }

    async linkPet(tutorId: number, petId: number): Promise<void> {
        await linkPetToTutor(tutorId, petId);
    }

    async unlinkPet(tutorId: number, petId: number): Promise<void> {
        await unlinkPetFromTutor(tutorId, petId);
    }
}

export const appFacade = new AppFacade();
