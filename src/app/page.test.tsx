import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import Home from "@/app/page";
import { storage } from "@/services/storage";
import { appFacade } from "@/services/facade";
import { listPets } from "@/services/pets";

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

jest.mock("@/components/PetsCarousel", () => ({
  PetsCarousel: () => <div>Carousel</div>,
}));

jest.mock("@/services/storage", () => ({
  storage: { getToken: jest.fn() },
}));

jest.mock("@/services/pets", () => ({
  listPets: jest.fn(),
}));

jest.mock("@/services/facade", () => {
  const { BehaviorSubject } = require("rxjs");
  return {
    appFacade: {
      pets$: new BehaviorSubject([]),
      petsState$: new BehaviorSubject({
        loading: false,
        error: null,
        page: 0,
        totalPages: 1,
      }),
      loadPets: jest.fn(),
    },
  };
});

describe("Home page", () => {
  it("shows login prompt when not authenticated", async () => {
    (storage.getToken as jest.Mock).mockReturnValue(null);

    render(<Home />);

    expect(await screen.findByText("Fazer login")).toBeInTheDocument();
  });

  it("renders search when authenticated", async () => {
    (storage.getToken as jest.Mock).mockReturnValue("token");
    (appFacade.loadPets as jest.Mock).mockResolvedValue({ content: [], pageCount: 1 });
    (listPets as jest.Mock).mockResolvedValue({ content: [], pageCount: 1 });

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Buscar pets por nome...")
      ).toBeInTheDocument();
    });
  });
});
