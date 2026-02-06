import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  icons: {
    icon: "/icone-de-cao-e-gato.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
