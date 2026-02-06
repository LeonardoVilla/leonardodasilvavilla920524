import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600">
          Desenvolvido por <span className="font-semibold text-gray-800">Leonardo Villa</span>
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="https://www.linkedin.com/in/leonardotech/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Leonardo Villa"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#2FA5A4] hover:text-[#2FA5A4]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M4.98 3.5a2.48 2.48 0 1 0 .04 4.96 2.48 2.48 0 0 0-.04-4.96zM3 8.98h4v12H3v-12zm7 0h3.83v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v6.3h-4v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-4v-12z" />
            </svg>
          </Link>
          <Link
            href="https://www.instagram.com/leonardovilla.tech/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Leonardo Villa"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#2FA5A4] hover:text-[#2FA5A4]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.3-8.6a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0zm3.3 1.17c-.07-1.36-.38-2.56-1.38-3.56-1-1-2.2-1.31-3.56-1.38-1.41-.08-5.63-.08-7.04 0-1.36.07-2.56.38-3.56 1.38-1 1-1.31 2.2-1.38 3.56-.08 1.41-.08 5.63 0 7.04.07 1.36.38 2.56 1.38 3.56 1 1 2.2 1.31 3.56 1.38 1.41.08 5.63.08 7.04 0 1.36-.07 2.56-.38 3.56-1.38 1-1 1.31-2.2 1.38-3.56.08-1.41.08-5.63 0-7.04zM20 19.1a3.78 3.78 0 0 1-2.13 2.13c-1.47.58-4.96.45-5.87.45s-4.4.13-5.87-.45A3.78 3.78 0 0 1 4 19.1c-.58-1.47-.45-4.96-.45-5.87s-.13-4.4.45-5.87A3.78 3.78 0 0 1 6.13 5.2c1.47-.58 4.96-.45 5.87-.45s4.4-.13 5.87.45A3.78 3.78 0 0 1 20 7.33c.58 1.47.45 4.96.45 5.87s.13 4.4-.45 5.87z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
