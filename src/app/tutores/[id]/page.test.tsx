import { render, screen } from "@testing-library/react";
import Page from "@/app/tutores/[id]/page";

jest.mock("next/dynamic", () => () => () => (
  <div data-testid="tutor-detail-dynamic">Tutor detail dynamic</div>
));

describe("Tutor detail page wrapper", () => {
  it("renders dynamic detail component", () => {
    render(<Page />);

    expect(screen.getByTestId("tutor-detail-dynamic")).toBeInTheDocument();
  });
});
