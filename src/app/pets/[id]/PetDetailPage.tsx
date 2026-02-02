"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PetResponseCompletoDto, PetRequestDto, ProprietarioResponseDto } from "@/types/api";
import { Navbar } from "@/components/Navbar";
import { PetForm } from "@/components/PetForm";
import Swal from "sweetalert2";
import { appFacade } from "@/services/facade";
import { getTutorById } from "@/services/tutores";

export default function PetDetailPage() {
    const params = useParams();
    const petId = params?.id as string;
    const isNew = petId === "novo";

    const [pet, setPet] = useState<PetResponseCompletoDto | null>(null);
    const [loading, setLoading] = useState(!isNew);
    const [editing, setEditing] = useState(isNew);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tutoresDetalhes, setTutoresDetalhes] = useState<ProprietarioResponseDto[]>([]);
    const router = useRouter();

    useEffect(() => {
        const petSub = appFacade.selectedPet$.subscribe(setPet);
        const stateSub = appFacade.petDetailState$.subscribe((state) => {
            setLoading(state.loading);
            setError(state.error);
        });

        return () => {
            petSub.unsubscribe();
            stateSub.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isNew) {
            (async () => {
                const { storage } = await import("@/services/storage");
                const token = storage.getToken();
                if (!token) {
                    router.replace("/login");
                    return;
                }

                try {
                    await appFacade.loadPetById(petId);
                } catch (err) {
                    // estado de erro já é atualizado no facade
                }
            })();
        } else {
            appFacade.clearSelectedPet();
        }
    }, [petId, isNew, router]);

    useEffect(() => {
        let isActive = true;

        (async () => {
            if (!pet?.tutores || pet.tutores.length === 0) {
                if (isActive) setTutoresDetalhes([]);
                return;
            }

            try {
                const detalhes = await Promise.all(
                    pet.tutores.map((tutor) => getTutorById(tutor.id))
                );
                if (isActive) {
                    setTutoresDetalhes(detalhes);
                }
            } catch {
                if (isActive) setTutoresDetalhes([]);
            }
        })();

        return () => {
            isActive = false;
        };
    }, [pet?.tutores]);

    const handleFormSubmit = async (data: PetRequestDto) => {
        try {
            if (isNew) {
                const result = await appFacade.createPet(data);
                setEditing(false);
                router.push(`/pets/${result.id}`);
            } else {
                await appFacade.updatePet(Number(petId), data);
                setEditing(false);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar");
            throw err;
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pet) return;

        setUploading(true);
        try {
            await appFacade.addPetPhoto(pet.id, file);
            setError(null);
        } catch (err) {
            setError("Erro ao fazer upload da foto");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!pet) return;
        const result = await Swal.fire({
            title: "Excluir pet",
            text: "Tem certeza que deseja excluir este pet?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#DC2626",
        });
        if (!result.isConfirmed) return;

        setDeleting(true);
        try {
            await appFacade.deletePet(pet.id);
            await Swal.fire({
                title: "Excluído",
                text: "Pet excluído com sucesso.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            router.push("/");
        } catch (err) {
            setError("Erro ao excluir pet");
            await Swal.fire({
                title: "Erro",
                text: "Não foi possível excluir o pet.",
                icon: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FA5A4] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (error && !isNew) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link href="/" className="text-[#2FA5A4] hover:underline">
                        Voltar para pets
                    </Link>
                </div>
            </div>
        );
    }

    const tutoresParaExibir =
        tutoresDetalhes.length > 0 ? tutoresDetalhes : pet?.tutores;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {editing ? "Novo Pet" : pet?.nome}
                            </h1>
                            {!editing && pet && (
                                <p className="text-gray-600 mt-2">
                                    {pet.raca && <span>{pet.raca} • </span>}
                                    {pet.idade && <span>{pet.idade} anos</span>}
                                </p>
                            )}
                        </div>
                        {!editing && pet && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-[#2FA5A4] text-white rounded-lg hover:bg-[#2FA5A4]"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleting ? "Excluindo..." : "Excluir"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Foto */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="aspect-square rounded-lg bg-gradient-to-br from-[#2FA5A4] to-[#2FA5A4] flex items-center justify-center text-6xl mb-4 overflow-hidden">
                                {pet?.foto?.url ? (
                                    <img
                                        src={pet.foto.url}
                                        alt={pet.nome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    "🐾"
                                )}
                            </div>

                            {!editing && (
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                    <div className="cursor-pointer px-4 py-2 border-2 border-[#2FA5A4] text-[#2FA5A4] rounded-lg hover:bg-[#2FA5A4]/10 text-center font-medium">
                                        {uploading ? "Enviando..." : "Alterar foto"}
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Informações */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {editing ? (
                                <PetForm
                                    onSubmit={handleFormSubmit}
                                    initialData={pet || undefined}
                                    error={error || undefined}
                                />
                            ) : pet ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                                            Nome
                                        </h3>
                                        <p className="text-xl font-bold text-gray-900">{pet.nome}</p>
                                    </div>

                                    {pet.raca && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">
                                                Raça
                                            </h3>
                                            <p className="text-gray-900">{pet.raca}</p>
                                        </div>
                                    )}

                                    {pet.idade !== undefined && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">
                                                Idade
                                            </h3>
                                            <p className="text-gray-900">{pet.idade} anos</p>
                                        </div>
                                    )}

                                    {tutoresParaExibir && tutoresParaExibir.length > 0 && (
                                        <div className="border-t pt-6">
                                            <h3 className="text-sm font-medium text-gray-600 mb-4">
                                                Tutores
                                            </h3>
                                            <div className="space-y-3">
                                                {tutoresParaExibir.map((tutor) => (
                                                    <Link
                                                        key={tutor.id}
                                                        href={`/tutores/${tutor.id}`}
                                                        className="block p-3 border rounded-lg hover:bg-[#2FA5A4]/10 transition"
                                                    >
                                                        <p className="font-medium text-gray-900">
                                                            {tutor.nome}
                                                        </p>
                                                        {tutor.telefone && (
                                                            <p className="text-sm text-gray-600">
                                                                {tutor.telefone}
                                                            </p>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {!isNew && (
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="text-[#2FA5A4] hover:underline font-medium"
                        >
                            ← Voltar para pets
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
