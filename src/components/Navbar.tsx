"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/auth";

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#2FA5A4]">
                            <Image
                                src="/icone-de-cao-e-gato.png"
                                alt="PetManager"
                                width={68}
                                height={68}
                                className="h-18 w-18"
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
                            🐾 Pets
                        </Link>

                        <Link
                            href="/tutores"
                            className={`px-4 py-2 rounded-lg transition ${isActive("/tutores")
                                ? "bg-[#2FA5A4] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            👤 Tutores
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <details className="dropdown">
                            <summary className="btn btn-ghost">
                                ☰
                            </summary>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link href="/">🐾 Pets</Link>
                                </li>
                                <li>
                                    <Link href="/tutores">👤 Tutores</Link>
                                </li>
                            </ul>
                        </details>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
}
