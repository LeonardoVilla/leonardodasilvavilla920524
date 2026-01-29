"use client";

import { useState } from "react";
import { PetRequestDto } from "@/types/api";
import { validation, masks } from "@/utils/validation";

interface PetFormProps {
  onSubmit: (data: PetRequestDto) => Promise<void>;
  initialData?: PetRequestDto & { id?: number };
  loading?: boolean;
  error?: string;
}

export function PetForm({ onSubmit, initialData, loading, error }: PetFormProps) {
  const [formData, setFormData] = useState<PetRequestDto>({
    nome: initialData?.nome || "",
    raca: initialData?.raca || "",
    idade: initialData?.idade || undefined,
  });

  const [formError, setFormError] = useState<string | null>(error || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "idade") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validações
    if (!validation.isValidName(formData.nome)) {
      setFormError("Nome do pet é obrigatório (mínimo 3 caracteres)");
      return;
    }

    if (formData.idade && !validation.isValidAge(formData.idade)) {
      setFormError("Idade deve ser entre 1 e 50 anos");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erro ao salvar pet"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Pet *
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: Rex, Luna..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
          required
        />
      </div>

      {/* Raça */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Raça
        </label>
        <input
          type="text"
          name="raca"
          value={formData.raca || ""}
          onChange={handleChange}
          placeholder="Ex: Labrador, Siamese..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
        />
      </div>

      {/* Idade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Idade (anos)
        </label>
        <input
          type="number"
          name="idade"
          value={formData.idade || ""}
          onChange={handleChange}
          placeholder="Ex: 3"
          min="1"
          max="50"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
        />
      </div>

      {/* Erro */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{formError || error}</p>
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={isSubmitting || loading}
        className="w-full px-4 py-2 bg-[#2FA5A4] text-white rounded-lg
                   hover:bg-[#2FA5A4] disabled:opacity-50 disabled:cursor-not-allowed
                   transition font-medium"
      >
        {isSubmitting || loading ? "Salvando..." : "Salvar Pet"}
      </button>
    </form>
  );
}
