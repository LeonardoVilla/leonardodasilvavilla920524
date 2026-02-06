import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import TutorDetailPage from "@/app/tutores/[id]/TutorDetailPage";
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

jest.mock("@/services/facade", () => {
  const { BehaviorSubject } = require("rxjs");
  return {
    appFacade: {
      selectedTutor$: new BehaviorSubject(null),
      tutorDetailState$: new BehaviorSubject({ loading: false, error: null }),
      loadTutorById: jest.fn(),
      clearSelectedTutor: jest.fn(),
      loadPets: jest.fn(),
      createTutor: jest.fn(),
      updateTutor: jest.fn(),
      addTutorPhoto: jest.fn(),
      deleteTutor: jest.fn(),
      linkPet: jest.fn(),
      unlinkPet: jest.fn(),
    },
  };
});

describe("Tutor detail page", () => {
  it("shows login prompt when creating without token", () => {
    (storage.getToken as jest.Mock).mockReturnValue(null);

    render(<TutorDetailPage />);

    expect(screen.getByText("Novo Tutor")).toBeInTheDocument();
    expect(screen.getByText("Fazer login")).toBeInTheDocument();
  });
});
