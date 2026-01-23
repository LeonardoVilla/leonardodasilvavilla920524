"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, senha);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Acessar sistema
        </h1>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
            required
          />
        </div>

        {/* Erro */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium
                     hover:bg-blue-700 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}