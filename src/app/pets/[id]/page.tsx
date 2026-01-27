"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/services/api";
import { createPet, updatePet, addPetPhoto } from "@/services/pets";
import { PetResponseCompletoDto, PetRequestDto } from "@/types/api";
import { Navbar } from "@/components/Navbar";
import { PetForm } from "@/components/PetForm";

export default function PetDetailPage() {
  const params = useParams();
  const petId = params?.id as string;
  const isNew = petId === "novo";

  const [pet, setPet] = useState<PetResponseCompletoDto | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [editing, setEditing] = useState(isNew);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
          const data = await apiFetch<PetResponseCompletoDto>(`/v1/pets/${petId}`);
          setPet(data);
        } catch (err) {
          setError("Pet não encontrado");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [petId, isNew, router]);

  const handleFormSubmit = async (data: PetRequestDto) => {
    try {
      if (isNew) {
        const result = await createPet(data);
        setPet(result as any);
        setEditing(false);
        router.push(`/pets/${result.id}`);
      } else {
        const result = await updatePet(Number(petId), data);
        setPet(result as any);
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
      const foto = await addPetPhoto(pet.id, file);
      setPet({ ...pet, foto });
      setError(null);
    } catch (err) {
      setError("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para pets
          </Link>
        </div>
      </div>
    );
  }

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
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl mb-4 overflow-hidden">
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
                  <div className="cursor-pointer px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-center font-medium">
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

                  {pet.tutores && pet.tutores.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">
                        Tutores
                      </h3>
                      <div className="space-y-3">
                        {pet.tutores.map((tutor) => (
                          <Link
                            key={tutor.id}
                            href={`/tutores/${tutor.id}`}
                            className="block p-3 border rounded-lg hover:bg-blue-50 transition"
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
              className="text-blue-600 hover:underline font-medium"
            >
              ← Voltar para pets
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
