import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("renders author and social links", () => {
    render(<Footer />);

    expect(screen.getByText(/Desenvolvido por/i)).toBeInTheDocument();

    expect(screen.getByLabelText("GitHub de Leonardo Villa")).toHaveAttribute(
      "href",
      "https://github.com/LeonardoVilla"
    );
    expect(screen.getByLabelText("LinkedIn de Leonardo Villa")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/leonardotech/"
    );
    expect(screen.getByLabelText("Instagram de Leonardo Villa")).toHaveAttribute(
      "href",
      "https://www.instagram.com/leonardovilla.tech/"
    );
  });
});
