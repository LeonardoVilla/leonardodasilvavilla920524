"use client";

import dynamic from "next/dynamic";

const PetDetailPage = dynamic(() => import("./PetDetailPage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FA5A4] mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <PetDetailPage />;
}
