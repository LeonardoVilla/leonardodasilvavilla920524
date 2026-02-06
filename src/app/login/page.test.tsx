import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

jest.mock("@/services/auth", () => ({
  login: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login page", () => {
  it("submits credentials and redirects", async () => {
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
    (login as jest.Mock).mockResolvedValue({});

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Usuário: admin"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("senha: admin"), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(replaceMock).toHaveBeenCalledWith("/");
  });
});
