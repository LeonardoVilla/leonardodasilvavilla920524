import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import Page from "@/app/tutores/page";

jest.mock("next/dynamic", () => () => () => (
  <div data-testid="tutores-dynamic">Tutores dynamic</div>
));

describe("Tutores page wrapper", () => {
  it("renders dynamic component", () => {
    render(<Page />);

    expect(screen.getByTestId("tutores-dynamic")).toBeInTheDocument();
  });
});
