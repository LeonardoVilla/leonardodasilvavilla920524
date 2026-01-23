"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export default function Home() {
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/v1/pets")
      .then(data => {
        if (Array.isArray(data.content)) {
          setPets(data.content); // ✅ array garantido
        } else {
          setPets([]); // segurança
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Pets</h1>
      <ul>
        {pets.map(pet => (
          <li key={pet.id}>{pet.nome}</li>
        ))}
      </ul>
    </div>
  );
}