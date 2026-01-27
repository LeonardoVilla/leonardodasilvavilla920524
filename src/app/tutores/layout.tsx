"use client";

import { Suspense } from "react";

export default function TutoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      {children}
    </Suspense>
  );
}
