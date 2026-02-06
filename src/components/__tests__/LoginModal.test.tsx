import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginModal } from "@/components/LoginModal";
import { login } from "@/services/auth";

jest.mock("@/services/auth", () => ({
  login: jest.fn(),
}));

describe("LoginModal", () => {
  it("does not render when closed", () => {
    render(<LoginModal isOpen={false} onClose={jest.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits credentials and calls callbacks", async () => {
    (login as jest.Mock).mockResolvedValue({});
    const onClose = jest.fn();
    const onSuccess = jest.fn();

    render(<LoginModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    const inputs = screen.getAllByPlaceholderText("admin");
    fireEvent.change(inputs[0], { target: { value: " admin " } });
    fireEvent.change(inputs[1], { target: { value: "admin" } });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(login).toHaveBeenCalledWith("admin", "admin");
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows error message when login fails", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("Falha no login"));

    render(<LoginModal isOpen={true} onClose={jest.fn()} />);

    const inputs = screen.getAllByPlaceholderText("admin");
    fireEvent.change(inputs[0], { target: { value: "admin" } });
    fireEvent.change(inputs[1], { target: { value: "admin" } });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Falha no login")).toBeInTheDocument();
  });
});
