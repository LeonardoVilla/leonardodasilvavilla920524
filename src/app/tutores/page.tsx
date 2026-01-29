"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/services/api";
import { ProprietarioResponseDto, PagedProprietarioResponseDto } from "@/types/api";
import { Navbar } from "@/components/Navbar";

export default function TutoresPage() {
    const [tutores, setTutores] = useState<ProprietarioResponseDto[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const params = new URLSearchParams({
                    page: String(page),
                    size: "10",
                });

                if (searchName) params.append("nome", searchName);

                const data = await apiFetch<PagedProprietarioResponseDto>(
                    `/v1/tutores?${params.toString()}`
                );
                setTutores(Array.isArray(data.content) ? data.content : []);
                setTotalPages(data.pageCount || 1);
                setError(null);
            } catch (err) {
                setError("Não foi possível carregar os tutores. Tente novamente.");
                setTutores([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [router, page, searchName]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FA5A4] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando tutores...</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">
                            <span className="inline-flex items-center gap-2">
                                <Image
                                    src="/icone-de-tutor-menu.png"
                                    alt="Tutores"
                                    width={28}
                                    height={28}
                                    className="h-7 w-7"
                                />
                                Tutores
                            </span>
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Listagem completa de todos os tutores do sistema</p>
                    </div>
                    <Link
                        href="/tutores/novo"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        + Novo Tutor
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
                            placeholder="Buscar tutores por nome..."
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                setPage(0);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                         focus:border-[#2FA5A4]"
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

                {/* Tutores Table */}
                {tutores.length > 0 ? (
                    <div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                                Nome
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                                Telefone
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                                Endereço
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tutores.map((tutor, idx) => (
                                            <tr
                                                key={tutor.id}
                                                className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2FA5A4] to-[#2FA5A4] flex items-center justify-center text-white font-bold">
                                                            {tutor.nome?.charAt(0).toUpperCase() || "?"}
                                                        </div>
                                                        <span className="font-medium text-gray-900">
                                                            {tutor.nome}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {tutor.email || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {tutor.telefone || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 truncate">
                                                    {tutor.endereco || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/tutores/${tutor.id}`}
                                                        className="inline-flex items-center px-4 py-2 text-sm bg-[#2FA5A4] text-white rounded-lg hover:bg-[#2FA5A4] transition whitespace-nowrap"
                                                    >
                                                        Ver detalhes
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                                    ? "bg-[#2FA5A4] text-white"
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
                            Página {page + 1} de {totalPages} • Total de {tutores.length} tutor{tutores.length !== 1 ? "es" : ""}
                        </div>
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-12">
                        <p className="text-6xl mb-4">👤</p>
                        <p className="text-gray-600 text-lg">Nenhum tutor encontrado</p>
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
