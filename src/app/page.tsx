"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/services/api";
import { PetResponseDto, PagedPetResponseDto } from "@/types/api";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  // 🔹 dados
  const [pets, setPets] = useState<PetResponseDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");

  // 🔹 estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      // 1️⃣ Verifica login ANTES de chamar a API
      const { storage } = await import("@/services/storage");
      const token = storage.getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      // 2️⃣ Busca os pets
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: "10",
        });

        if (searchName) params.append("nome", searchName);

        const data = await apiFetch<PagedPetResponseDto>(
          `/v1/pets?${params.toString()}`
        );
        setPets(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.pageCount || 1);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os pets. Tente novamente.");
        setPets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [router, page, searchName]);

  const handleLogout = () => {
    const { logout } = require("@/services/auth");
    logout();
    router.replace("/login");
  };

  // 5️⃣ Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🐾 Pets</h1>
            <p className="text-gray-600 text-sm mt-1">Listagem completa de todos os pets do sistema</p>
          </div>
          <Link
            href="/pets/novo"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Novo Pet
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <input
              type="text"
              placeholder="Buscar pets por nome..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setPage(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pets.map((pet) => (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer group"
                >
                  {/* Pet Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden relative">
                    {pet.foto?.url ? (
                      <img
                        src={pet.foto.url}
                        alt={pet.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-6xl">🐾</span>
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {pet.nome}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {pet.raca && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Raça:</span>
                          <span>{pet.raca}</span>
                        </div>
                      )}

                      {pet.idade !== undefined && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Idade:</span>
                          <span>{pet.idade} ano{pet.idade !== 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium">
                      Ver detalhes
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = Math.max(0, page - 2) + i;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition ${pageNum === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Próxima →
                </button>
              </div>
            )}

            {/* Info */}
            <div className="text-center text-gray-600 text-sm mt-6">
              Página {page + 1} de {totalPages}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🐾</p>
            <p className="text-gray-600 text-lg">Nenhum pet encontrado</p>
            {searchName && (
              <p className="text-gray-500 text-sm mt-2">
                Tente ajustar sua busca
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
