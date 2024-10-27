import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { getAuth } from "../../services/getAuth";
import { Login } from "./Login";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
  });

vi.mock("../../services/getAuth", () => ({
  getAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockGetAuth = getAuth as Mock;

describe("<Login />", () => {
  const renderLogin = () => {
    return render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    );
  };

  it("should show error message", async () => {
    mockGetAuth.mockRejectedValue(new Error("Invalid username or password"));
    renderLogin();
    const usernameInput = screen.getByPlaceholderText(/username/i);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const buttonLogin = screen.getByRole("button", { name: "Login" });
    fireEvent.change(usernameInput, { target: { value: "invaliduser" } });
    fireEvent.change(passwordInput, { target: { value: "invalidpass" } });
    await act(async () => {
      fireEvent.click(buttonLogin);
    });
    await waitFor(() => {
      const errorMessage = screen.getByText("Invalid username or password");
      expect(mockGetAuth).toHaveBeenCalledWith("invaliduser", "invalidpass");
      expect(errorMessage).toBeInTheDocument();
    });
  });

    it("calls getAuth and navigates on successful login", async () => {
      mockGetAuth.mockResolvedValue({ success: true });
      renderLogin();

      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole("button", { name: /login/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: "validuser" } });
        fireEvent.change(passwordInput, { target: { value: "validpass" } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(mockGetAuth).toHaveBeenCalledWith("validuser", "validpass");
        expect(mockNavigate).toHaveBeenCalledWith("/orders");
      });
    });
});
