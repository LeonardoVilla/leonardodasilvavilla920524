"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PetResponseDto } from "@/types/api";

interface PetsCarouselProps {
  pets: PetResponseDto[];
  pageSize?: number;
  autoplayMs?: number;
  badge?: string;
  title?: string;
  subtitle?: string;
}

export function PetsCarousel({
  pets,
  pageSize = 2,
  autoplayMs = 6000,
  badge = "Adocao responsavel",
  title = "Eles esperam por voce.",
  subtitle = "Conheca pets que estao prontos para encontrar um lar.",
}: PetsCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const effectivePageSize = isMobile ? 1 : pageSize;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(pets.length / effectivePageSize)),
    [pets.length, effectivePageSize]
  );

  useEffect(() => {
    if (carouselIndex > totalPages - 1) {
      setCarouselIndex(0);
    }
  }, [carouselIndex, totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return;

    const intervalId = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % totalPages);
    }, autoplayMs);

    return () => window.clearInterval(intervalId);
  }, [autoplayMs, totalPages]);

  useEffect(() => {
    setIsTransitioning(true);
    const timeoutId = window.setTimeout(() => setIsTransitioning(false), 60);
    return () => window.clearTimeout(timeoutId);
  }, [carouselIndex, pets.length]);

  if (pets.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="rounded-3xl bg-gradient-to-br from-[#0F2D2E] via-[#1E5656] to-[#2FA5A4] p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              {badge}
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
              {title}
            </h2>
            <p className="mt-2 text-white/80">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
              disabled={carouselIndex === 0}
              className="h-11 w-11 rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
              aria-label="Ver pets anteriores"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCarouselIndex((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={carouselIndex >= totalPages - 1}
              className="h-11 w-11 rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
              aria-label="Ver proximos pets"
            >
              →
            </button>
          </div>
        </div>

        <div
          className={`mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 transition-all duration-500 ease-out ${
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {pets
            .slice(
              carouselIndex * effectivePageSize,
              carouselIndex * effectivePageSize + effectivePageSize
            )
            .map((pet) => (
              <div
                key={pet.id}
                className="flex flex-col md:flex-row gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="relative h-40 w-full md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl bg-white/20">
                  {pet.foto?.url ? (
                    <Image
                      src={pet.foto.url}
                      alt={pet.nome}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 128px, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🐾
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                      Para adocao
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                      {pet.nome}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-white/80">
                      {pet.raca && (
                        <p>
                          <span className="font-medium">Raca:</span> {pet.raca}
                        </p>
                      )}
                      {pet.idade !== undefined && (
                        <p>
                          <span className="font-medium">Idade:</span> {pet.idade} ano{pet.idade !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Ver historia
                    <span className="text-base">→</span>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(index)}
              className={`h-2 w-8 rounded-full transition ${
                index === carouselIndex
                  ? "bg-white"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Ir para grupo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
