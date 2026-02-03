"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import { logout } from "@/services/auth";
import { storage } from "@/services/storage";

export function Navbar() {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const updateAuth = () => setIsLoggedIn(Boolean(storage.getToken()));
        updateAuth();
        window.addEventListener("storage", updateAuth);
        return () => window.removeEventListener("storage", updateAuth);
    }, []);

    const isActive = (path: string) => pathname === path;

    const dispatchAuthChange = () => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new Event("pm-auth-change"));
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        dispatchAuthChange();
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        dispatchAuthChange();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <LoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#2FA5A4]">
                            <Image
                                src="/icone-de-cao-e-gato.png"
                                alt="PetManager"
                                width={68}
                                height={68}
                                className="h-12 w-12 md:h-18 md:w-18"
                                priority
                            />
                            PetManager
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition ${isActive("/")
                                ? "bg-[#2FA5A4] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                <Image
                                    src="/icone-de-cao-e-gato-menu.png"
                                    alt="Pets"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                Pets
                            </span>
                        </Link>

                        <Link
                            href="/tutores"
                            className={`px-4 py-2 rounded-lg transition ${isActive("/tutores")
                                ? "bg-[#2FA5A4] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                <Image
                                    src="/icone-de-tutor-menu.png"
                                    alt="Tutores"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                Tutores
                            </span>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <details className="dropdown">
                            <summary className="btn btn-ghost">
                                ☰
                            </summary>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56">
                                <li>
                                    <Link href="/" className="flex items-center gap-2">
                                        <Image
                                            src="/icone-de-cao-e-gato-menu.png"
                                            alt="Pets"
                                            width={20}
                                            height={20}
                                            className="h-5 w-5"
                                        />
                                        Pets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tutores" className="flex items-center gap-2">
                                        <Image
                                            src="/icone-de-tutor-menu.png"
                                            alt="Tutores"
                                            width={20}
                                            height={20}
                                            className="h-5 w-5"
                                        />
                                        Tutores
                                    </Link>
                                </li>
                                <li className="mt-1">
                                    {isLoggedIn ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center justify-center gap-2 text-red-600"
                                        >
                                            Sair
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex w-full items-center justify-center gap-2 text-gray-800"
                                        >
                                            Entrar
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </details>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-[#2FA5A4] hover:text-[#2FA5A4]"
                                aria-label="Abrir modal de login"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="ml-4 hidden items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 md:inline-flex"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
