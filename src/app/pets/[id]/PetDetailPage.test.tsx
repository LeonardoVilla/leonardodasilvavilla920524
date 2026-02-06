import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import PetDetailPage from "@/app/pets/[id]/PetDetailPage";
import { storage } from "@/services/storage";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "novo" }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

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

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("@/components/Navbar", () => ({
  Navbar: () => <nav>Navbar</nav>,
}));

jest.mock("@/services/storage", () => ({
  storage: { getToken: jest.fn() },
}));

jest.mock("@/services/tutores", () => ({
  getTutorById: jest.fn(),
}));

jest.mock("@/services/facade", () => {
  const { BehaviorSubject } = require("rxjs");
  return {
    appFacade: {
      selectedPet$: new BehaviorSubject(null),
      petDetailState$: new BehaviorSubject({ loading: false, error: null }),
      loadPetById: jest.fn(),
      clearSelectedPet: jest.fn(),
      createPet: jest.fn(),
      updatePet: jest.fn(),
      addPetPhoto: jest.fn(),
      deletePet: jest.fn(),
    },
  };
});

describe("Pet detail page", () => {
  it("shows login prompt when creating without token", () => {
    (storage.getToken as jest.Mock).mockReturnValue(null);

    render(<PetDetailPage />);

    expect(screen.getByText("Novo Pet")).toBeInTheDocument();
    expect(screen.getByText("Fazer login")).toBeInTheDocument();
  });
});
