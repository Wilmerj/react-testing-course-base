import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, Mock, vi, beforeEach } from "vitest";
import { useOrders } from "./useOrders";
import { SessionProvider, useSession } from "../context/AuthContext";
import { waitFor } from "@testing-library/dom";

// Mock del contexto de autenticación
vi.mock("../context/AuthContext", async () => {
  const actual = await vi.importActual("../context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

describe("useOrders hook", () => {
  // Configuración común para todos los tests
  const mockUser = { id: "1", name: "Test User" };
  
  beforeEach(() => {
    (useSession as Mock).mockReturnValue({ user: mockUser });
  });

  // Wrapper con tipos definidos
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  );

  it("should fetch orders successfully", async () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    // Esperamos a que los datos se carguen
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verificamos el estado final del hook
    expect(result.current.orders).toBeTruthy();
    expect(result.current.orders.length).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("should show loading state while fetching", () => {
    const { result } = renderHook(() => useOrders(), { wrapper });
    expect(result.current.loading).toBe(true);
  });
});