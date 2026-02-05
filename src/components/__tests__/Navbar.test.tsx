import { render, screen, waitFor } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";
import { storage } from "@/services/storage";

jest.mock("@/services/auth", () => ({
  logout: jest.fn(),
}));

jest.mock("@/services/storage", () => ({
  storage: {
    getToken: jest.fn(),
  },
}));

describe("Navbar", () => {
  beforeEach(() => {
    (storage.getToken as jest.Mock).mockReset();
  });

  it("shows login button when not authenticated", () => {
    (storage.getToken as jest.Mock).mockReturnValue(null);

    render(<Navbar />);

    expect(screen.getByLabelText("Abrir modal de login")).toBeInTheDocument();
  });

  it("shows logout button when authenticated", async () => {
    (storage.getToken as jest.Mock).mockReturnValue("test-token");

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getAllByText("Sair").length).toBeGreaterThan(0);
    });
  });
});
