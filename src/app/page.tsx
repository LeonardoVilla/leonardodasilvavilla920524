"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";

export default function Home() {
  // 🔹 dados
  const [pets, setPets] = useState<any[]>([]);

  // 🔹 estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // 1️⃣ Verifica login ANTES de chamar a API
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // 2️⃣ Busca os pets
    apiFetch("/v1/pets")
      .then((data) => {
        if (Array.isArray(data.content)) {
          setPets(data.content);
        } else {
          setPets([]);
        }
      })
      .catch(() => {
        // 3️⃣ Erro amigável (não redireciona à toa)
        setError(
          "Não foi possível carregar os dados agora. Tente novamente."
        );
      })
      .finally(() => {
        // 4️⃣ Finaliza loading SEMPRE
        setLoading(false);
      });
  }, [router]);

  // 5️⃣ Tela de carregamento
  if (loading) {
    return <p>Carregando dados...</p>;
  }

  // 6️⃣ Tela de erro amigável
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  // 7️⃣ Tela normal
  return (
    <div>
      <h1>Pets</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.nome}</li>
        ))}
      </ul>
    </div>
  );
}
