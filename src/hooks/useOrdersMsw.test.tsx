import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, Mock, vi, beforeEach } from "vitest";
import { SessionProvider, useSession } from "../context/AuthContext";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { useOrders } from "./useOrders";
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

  it("should failed fetch orders", async () => {
    server.use(
      http.get("http://localhost:3001/orders", () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      })
    );

    const { result } = renderHook(() => useOrders(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      "Failed to fetch orders. Please try again later."
    );
    expect(result.current.orders).toEqual([]);
  });
});
