import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import TutoresPage from "@/app/tutores/TutoresPage";
import { storage } from "@/services/storage";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

jest.mock("@/components/Navbar", () => ({
  Navbar: () => <nav>Navbar</nav>,
}));

jest.mock("@/services/storage", () => ({
  storage: { getToken: jest.fn() },
}));

jest.mock("@/services/facade", () => {
  const { BehaviorSubject } = require("rxjs");
  return {
    appFacade: {
      tutores$: new BehaviorSubject([]),
      tutoresState$: new BehaviorSubject({
        loading: false,
        error: null,
        page: 0,
        totalPages: 1,
      }),
      loadTutores: jest.fn(),
    },
  };
});

describe("Tutores page", () => {
  it("shows login prompt when not authenticated", async () => {
    (storage.getToken as jest.Mock).mockReturnValue(null);

    render(<TutoresPage />);

    await waitFor(() => {
      expect(screen.getByText("Fazer login")).toBeInTheDocument();
    });
  });
});
