import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TutorForm } from "@/components/TutorForm";

const fillInput = (placeholder: string, value: string) => {
  const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
  return input;
};

describe("TutorForm", () => {
  it("applies phone mask and submits valid data", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TutorForm onSubmit={onSubmit} />);

    fillInput("João da Silva", "Maria Silva");
    const phoneInput = fillInput("(11) 91234-5678", "11933334444");
    fillInput("joao@email.com", "maria@example.com");
    fillInput("Rua das Flores, 123, Bairro Centro, São Paulo - SP", "Rua das Flores, 123");

    expect(phoneInput.value).toBe("(11) 93333-4444");

    fireEvent.submit(screen.getByRole("button", { name: "Salvar Tutor" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      nome: "Maria Silva",
      email: "maria@example.com",
      telefone: "(11) 93333-4444",
      endereco: "Rua das Flores, 123",
      cpf: undefined,
    });
  });

  it("shows validation error for invalid phone", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TutorForm onSubmit={onSubmit} />);

    fillInput("João da Silva", "Maria Silva");
    fillInput("(11) 91234-5678", "1199");

    fireEvent.submit(screen.getByRole("button", { name: "Salvar Tutor" }));

    expect(await screen.findByText("Telefone inválido")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
