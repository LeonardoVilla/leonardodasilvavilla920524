"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { login } from "@/services/auth";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username.trim(), password);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao realizar login");
      } else {
        setError(String(err) || "Erro ao realizar login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">PetManager</p>
            <h2
              id="login-modal-title"
              className="text-2xl font-semibold text-gray-900"
            >
              Entrar no sistema
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-200 p-1 text-gray-600 transition hover:bg-gray-300"
            aria-label="Fechar modal de login"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA5A4]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#2FA5A4] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2FA5A4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
