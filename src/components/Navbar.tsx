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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const updateAuth = () => setIsLoggedIn(Boolean(storage.getToken()));
        updateAuth();
        window.addEventListener("storage", updateAuth);
        window.addEventListener("pm-auth-change", updateAuth);
        return () => {
            window.removeEventListener("storage", updateAuth);
            window.removeEventListener("pm-auth-change", updateAuth);
        };
    }, []);

    useEffect(() => {
        const openLogin = () => setIsModalOpen(true);
        window.addEventListener("pm-open-login", openLogin);
        return () => window.removeEventListener("pm-open-login", openLogin);
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
                    {isLoggedIn && (
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
                    )}

                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA5A4] md:hidden"
                            aria-controls="navbar-default"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Abrir menu</span>
                            <svg
                                className="h-6 w-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M5 7h14M5 12h14M5 17h14"
                                />
                            </svg>
                        </button>
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
                <div
                    id="navbar-default"
                    className={`${isMobileMenuOpen ? "block" : "hidden"} w-full md:hidden`}
                >
                    <ul className="mt-3 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium">
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link
                                        href="/"
                                        className={`block rounded-lg px-3 py-2 transition ${isActive("/")
                                            ? "bg-[#2FA5A4] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
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
                                </li>
                                <li>
                                    <Link
                                        href="/tutores"
                                        className={`block rounded-lg px-3 py-2 transition ${isActive("/tutores")
                                            ? "bg-[#2FA5A4] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
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
                                </li>
                            </>
                        )}
                        <li>
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50"
                                >
                                    Sair
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition hover:bg-gray-100"
                                >
                                    Entrar
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
