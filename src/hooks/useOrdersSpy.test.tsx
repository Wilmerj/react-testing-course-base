import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  Mock,
  MockInstance,
} from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrders } from "./useOrders";
import * as AuthContext from "../context/AuthContext";
import * as ReactRouter from "react-router-dom";
import * as OrderService from "../services/getOrders";

// Mockeamos react-router-dom de manera tradicional
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("useOrders", () => {
  // Declaramos los spies
  let useSessionSpy: MockInstance;
  let getOrdersSpy: MockInstance;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Configuramos los spies antes de cada test
    useSessionSpy = vi.spyOn(AuthContext, "useSession");
    getOrdersSpy = vi.spyOn(OrderService, "getOrders");

    // Configuramos useNavigate
    (ReactRouter.useNavigate as Mock).mockReturnValue(mockNavigate);

    // Limpiamos los spies y mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restauramos los spies después de cada test
    vi.restoreAllMocks();
  });

  it("should redirect to home if user is not authenticated", () => {
    useSessionSpy.mockReturnValue({ user: null });

    renderHook(() => useOrders());

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should fetch orders successfully when user is authenticated", async () => {
    const mockOrders = [
      { id: 1, title: "Order 1" },
      { id: 2, title: "Order 2" },
    ];

    useSessionSpy.mockReturnValue({ user: { id: 1 } });
    getOrdersSpy.mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders());

    // Verificar estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe(null);

    // Esperar a que se complete la carga
    await act(async () => {
      await Promise.resolve();
    });

    // Verificar estado final
    expect(result.current.loading).toBe(false);
    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.error).toBe(null);
    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle error when fetching orders fails", async () => {
    useSessionSpy.mockReturnValue({ user: { id: 1 } });
    getOrdersSpy.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useOrders());

    // Verificar estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Esperar a que se complete la carga
    await act(async () => {
      await Promise.resolve();
    });

    // Verificar estado final
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      "Failed to fetch orders. Please try again later."
    );
    expect(getOrdersSpy).toHaveBeenCalledTimes(1);
  });

  it("should not fetch orders if user is not authenticated", () => {
    useSessionSpy.mockReturnValue({ user: null });

    renderHook(() => useOrders());

    expect(getOrdersSpy).not.toHaveBeenCalled();
  });
});
