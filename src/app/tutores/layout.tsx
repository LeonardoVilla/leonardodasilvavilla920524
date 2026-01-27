"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const TutorPage = dynamic(() => import("./[id]/page"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando tutor...</p>
      </div>
    </div>
  ),
});

export default function TutoresLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TutorPage params={params} />
    </Suspense>
  );
}
