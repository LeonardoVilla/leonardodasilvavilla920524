"use client";

import { useState } from "react";
import { ProprietarioRequestDto } from "@/types/api";
import { validation, masks } from "@/utils/validation";

interface TutorFormProps {
  onSubmit: (data: ProprietarioRequestDto) => Promise<void>;
  initialData?: ProprietarioRequestDto & { id?: number };
  loading?: boolean;
  error?: string;
}

export function TutorForm({ onSubmit, initialData, loading, error }: TutorFormProps) {
  const [formData, setFormData] = useState<ProprietarioRequestDto>({
    nome: initialData?.nome || "",
    email: initialData?.email || "",
    telefone: initialData?.telefone || "",
    endereco: initialData?.endereco || "",
    cpf: initialData?.cpf || undefined,
  });

  const [formError, setFormError] = useState<string | null>(error || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData({
        ...formData,
        [name]: masks.phone(value),
      });
    } else if (name === "cpf") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(masks.unmask(value)) : undefined,
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
      setFormError("Nome completo é obrigatório (mínimo 3 caracteres)");
      return;
    }

    if (!validation.isValidPhone(formData.telefone)) {
      setFormError("Telefone inválido");
      return;
    }

    if (formData.email && !validation.isValidEmail(formData.email)) {
      setFormError("Email inválido");
      return;
    }

    if (formData.cpf && !validation.isValidCPF(String(formData.cpf))) {
      setFormError("CPF inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erro ao salvar tutor"
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
          Nome Completo *
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="João da Silva"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="joao@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
        />
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefone *
        </label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(11) 91234-5678"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
          required
        />
      </div>

      {/* CPF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CPF
        </label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf ? masks.cpf(String(formData.cpf)) : ""}
          onChange={handleChange}
          placeholder="000.000.000-00"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]
                     focus:border-[#2FA5A4]"
        />
      </div>

      {/* Endereço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Endereço
        </label>
        <textarea
          name="endereco"
          value={formData.endereco || ""}
          onChange={handleChange}
          placeholder="Rua das Flores, 123, Bairro Centro, São Paulo - SP"
          rows={3}
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
        {isSubmitting || loading ? "Salvando..." : "Salvar Tutor"}
      </button>
    </form>
  );
}
