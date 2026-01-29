"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/services/api";
import { createTutor, updateTutor, addTutorPhoto, linkPetToTutor, unlinkPetFromTutor } from "@/services/tutores";
import { ProprietarioResponseComPetsDto, ProprietarioRequestDto, PetResponseDto } from "@/types/api";
import { Navbar } from "@/components/Navbar";
import { TutorForm } from "@/components/TutorForm";

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params?.id as string;
  const isNew = tutorId === "novo";

  const [tutor, setTutor] = useState<ProprietarioResponseComPetsDto | null>(null);
  const [allPets, setAllPets] = useState<PetResponseDto[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [editing, setEditing] = useState(isNew);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { storage } = await import("@/services/storage");
      const token = storage.getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        if (!isNew) {
          const data = await apiFetch<ProprietarioResponseComPetsDto>(
            `/v1/tutores/${tutorId}`
          );
          setTutor(data);
        }

        // Carregar todos os pets
        const petsResponse = await apiFetch<any>("/v1/pets?size=100");
        setAllPets(petsResponse.content || []);
      } catch (err) {
        if (!isNew) {
          setError("Tutor não encontrado");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [tutorId, isNew, router]);

  const handleFormSubmit = async (data: ProprietarioRequestDto) => {
    try {
      if (isNew) {
        const result = await createTutor(data);
        setTutor(result as any);
        setEditing(false);
        router.push(`/tutores/${result.id}`);
      } else {
        const result = await updateTutor(Number(tutorId), data);
        setTutor(result as any);
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
    if (!file || !tutor) return;

    setUploading(true);
    try {
      const foto = await addTutorPhoto(tutor.id, file);
      setTutor({ ...tutor, foto });
      setError(null);
    } catch (err) {
      setError("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const handleAddPet = async (petId: number) => {
    if (!tutor) return;
    try {
      await linkPetToTutor(tutor.id, petId);
      const updated = await apiFetch<ProprietarioResponseComPetsDto>(
        `/v1/tutores/${tutor.id}`
      );
      setTutor(updated);
      setShowAddPetModal(false);
      setError(null);
    } catch (err) {
      setError("Erro ao vincular pet");
    }
  };

  const handleRemovePet = async (petId: number) => {
    if (!tutor) return;
    try {
      await unlinkPetFromTutor(tutor.id, petId);
      const updated = await apiFetch<ProprietarioResponseComPetsDto>(
        `/v1/tutores/${tutor.id}`
      );
      setTutor(updated);
      setError(null);
    } catch (err) {
      setError("Erro ao desvincular pet");
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
          <Link href="/tutores" className="text-[#2FA5A4] hover:underline">
            Voltar para tutores
          </Link>
        </div>
      </div>
    );
  }

  const availablePets = allPets.filter(
    (pet) => !tutor?.pets?.some((p) => p.id === pet.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editing ? "Novo Tutor" : tutor?.nome}
              </h1>
              {!editing && tutor && tutor.telefone && (
                <p className="text-gray-600 mt-2">{tutor.telefone}</p>
              )}
            </div>
            {!editing && tutor && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-[#2FA5A4] text-white rounded-lg hover:bg-[#2FA5A4]"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Foto */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-6xl mb-4 overflow-hidden">
                {tutor?.foto?.url ? (
                  <img
                    src={tutor.foto.url}
                    alt={tutor.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  tutor?.nome?.charAt(0).toUpperCase() || "?"
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
                <TutorForm
                  onSubmit={handleFormSubmit}
                  initialData={tutor || undefined}
                  error={error || undefined}
                />
              ) : tutor ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Nome
                    </h3>
                    <p className="text-xl font-bold text-gray-900">
                      {tutor.nome}
                    </p>
                  </div>

                  {tutor.email && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Email
                      </h3>
                      <p className="text-gray-900">{tutor.email}</p>
                    </div>
                  )}

                  {tutor.telefone && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Telefone
                      </h3>
                      <p className="text-gray-900">{tutor.telefone}</p>
                    </div>
                  )}

                  {tutor.endereco && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Endereço
                      </h3>
                      <p className="text-gray-900">{tutor.endereco}</p>
                    </div>
                  )}

                  {tutor.cpf && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        CPF
                      </h3>
                      <p className="text-gray-900">{tutor.cpf}</p>
                    </div>
                  )}

                  {/* Pets */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-600">
                        Pets Vinculados ({tutor.pets?.length || 0})
                      </h3>
                      <button
                        onClick={() => setShowAddPetModal(true)}
                        disabled={availablePets.length === 0}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        + Vincular
                      </button>
                    </div>

                    {tutor.pets && tutor.pets.length > 0 ? (
                      <div className="space-y-2">
                        {tutor.pets.map((pet) => (
                          <div
                            key={pet.id}
                            className="flex justify-between items-center p-3 border rounded-lg"
                          >
                            <Link
                              href={`/pets/${pet.id}`}
                              className="flex-1 text-[#2FA5A4] hover:underline"
                            >
                              <p className="font-medium">{pet.nome}</p>
                              {pet.raca && (
                                <p className="text-sm text-gray-600">{pet.raca}</p>
                              )}
                            </Link>
                            <button
                              onClick={() => handleRemovePet(pet.id)}
                              className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm italic">
                        Nenhum pet vinculado
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Modal de Vincular Pet */}
        {showAddPetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Vincular Pet</h3>

              {availablePets.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {availablePets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handleAddPet(pet.id)}
                      className="w-full text-left p-3 border rounded-lg hover:bg-[#2FA5A4]/10 transition"
                    >
                      <p className="font-medium">{pet.nome}</p>
                      {pet.raca && (
                        <p className="text-sm text-gray-600">{pet.raca}</p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  Não há pets disponíveis para vincular
                </p>
              )}

              <button
                onClick={() => setShowAddPetModal(false)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {!isNew && (
          <div className="mt-8">
            <Link
              href="/tutores"
              className="text-[#2FA5A4] hover:underline font-medium"
            >
              ← Voltar para tutores
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
