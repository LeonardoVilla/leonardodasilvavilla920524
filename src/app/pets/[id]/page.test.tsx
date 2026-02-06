import { render, screen } from "@testing-library/react";
import Page from "@/app/pets/[id]/page";

jest.mock("next/dynamic", () => () => () => (
  <div data-testid="pet-detail-dynamic">Pet detail dynamic</div>
));

describe("Pets detail page wrapper", () => {
  it("renders dynamic detail component", () => {
    render(<Page />);

    expect(screen.getByTestId("pet-detail-dynamic")).toBeInTheDocument();
  });
});
