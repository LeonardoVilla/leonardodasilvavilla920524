import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PetForm } from "@/components/PetForm";

const fillInput = (placeholder: string, value: string) => {
  const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
  return input;
};

describe("PetForm", () => {
  it("submits valid data", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<PetForm onSubmit={onSubmit} />);

    fillInput("Ex: Rex, Luna...", "Rex");
    fillInput("Ex: Cachorro, Gato...", "Cachorro");
    fillInput("Ex: Labrador, Siamese...", "Labrador");
    fillInput("Ex: 3", "3");

    fireEvent.submit(screen.getByRole("button", { name: "Salvar Pet" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      nome: "Rex",
      especie: "Cachorro",
      raca: "Labrador",
      idade: 3,
    });
  });

  it("shows validation error for short name", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<PetForm onSubmit={onSubmit} />);

    fillInput("Ex: Rex, Luna...", "Jo");
    fireEvent.submit(screen.getByRole("button", { name: "Salvar Pet" }));

    expect(
      await screen.findByText("Nome do pet é obrigatório (mínimo 3 caracteres)")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for missing species", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<PetForm onSubmit={onSubmit} />);

    fillInput("Ex: Rex, Luna...", "Rex");
    fillInput("Ex: Cachorro, Gato...", "Ca");

    fireEvent.submit(screen.getByRole("button", { name: "Salvar Pet" }));

    expect(
      await screen.findByText(
        "Espécie do pet é obrigatória (mínimo 3 caracteres)"
      )
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
