import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PetsCarousel } from "@/components/PetsCarousel";
import type { PetResponseDto } from "@/types/api";

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

const createMatchMedia = () =>
  function matchMedia(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as unknown as MediaQueryList;
  };

describe("PetsCarousel", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMedia(),
    });
  });

  it("renders pets and navigation buttons", () => {
    const pets: PetResponseDto[] = [
      { id: 1, nome: "Luna", raca: "SRD", idade: 2 },
      { id: 2, nome: "Thor", raca: "Labrador", idade: 3 },
    ];

    render(<PetsCarousel pets={pets} pageSize={2} />);

    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.getByText("Thor")).toBeInTheDocument();

    expect(screen.getByLabelText("Ver pets anteriores")).toBeDisabled();
    expect(screen.getByLabelText("Ver proximos pets")).toBeDisabled();

    expect(screen.getByLabelText("Ir para grupo 1")).toBeInTheDocument();
  });

  it("renders nothing when pets list is empty", () => {
    render(<PetsCarousel pets={[]} />);

    expect(screen.queryByText("Eles esperam por voce.")).not.toBeInTheDocument();
  });
});
