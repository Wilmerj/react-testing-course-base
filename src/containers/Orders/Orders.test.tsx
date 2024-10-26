import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider, useSession } from "../../context/AuthContext";
import { getOrders } from "../../services/getOrders";
import { getSummaryOrders } from "../../utils/sumamry";
import { Orders } from "./Orders";

// 1. Mock del servicio de órdenes
vi.mock("../../services/getOrders", () => ({
  getOrders: vi.fn(),
}));

// 2. Mock del contexto de autenticación
vi.mock("../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockGetOrders = getOrders as Mock;

const mockOrders = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    customer: {
      id: "60d07f61-99bf-4b90-955b-5d3a7c9bb3d4",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    products: [
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        name: "Laptop",
        price: 999.99,
        quantity: 1,
      },
    ],
    total: 1029.98,
    status: "delivered",
    orderDate: "2023-10-01T10:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "credit_card",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    customer: {
      id: "60d07f61-99bf-4b90-955b-5d3a7c9bb3d4",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    products: [
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        name: "Laptop",
        price: 999.99,
        quantity: 1,
      },
    ],
    total: 1029.98,
    status: "delivered",
    orderDate: "2023-10-01T10:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "credit_card",
  },
];

const renderOrders = (userRole: string) => {
  const mockUser = userRole ? { role: userRole } : null;
  (useSession as Mock).mockReturnValue({ user: mockUser });
  return render(
    <SessionProvider>
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    </SessionProvider>
  );
};

describe("<Orders />", () => {
  it("renders loading state", () => {
    renderOrders("visualizer");
    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();
  });

  it("should render first order", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    renderOrders("visualizer");

    await waitFor(() => {
      const firstOrder = screen.getByText(
        `Order #${mockOrders[0].id.slice(0, 8)}`
      );
      expect(firstOrder).toBeInTheDocument();
    });
  });

  it("should render all orders", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    renderOrders("visualizer");

    await waitFor(() => {
      const orders = screen.getAllByRole("heading", { level: 3 });
      expect(orders).toHaveLength(mockOrders.length);
    });
  });

  it("renders OrderSummary for a superadmin", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    renderOrders("superadmin");

    await waitFor(() => {
      const { totalOrders } = getSummaryOrders(mockOrders);
      const summaryTotalOrders = screen.getAllByText(totalOrders);
      expect(summaryTotalOrders).toBe(totalOrders.toString());
    });
  });
});
