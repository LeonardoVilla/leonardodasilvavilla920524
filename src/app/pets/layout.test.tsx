import { render, screen } from "@testing-library/react";
import PetsLayout from "@/app/pets/layout";

describe("Pets layout", () => {
  it("renders children", () => {
    render(
      <PetsLayout>
        <div>Pets child</div>
      </PetsLayout>
    );

    expect(screen.getByText("Pets child")).toBeInTheDocument();
  });
});
