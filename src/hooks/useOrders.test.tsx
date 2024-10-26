import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { useOrders } from './useOrders';
import { getOrders } from '../services/getOrders';
import { useSession } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock the dependencies
vi.mock('../services/getOrders', () => ({
  getOrders: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useSession: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('useOrders', () => {
  const mockNavigate = vi.fn();
  const mockGetOrders = getOrders as Mock;
  const mockUseSession = useSession as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it('should fetch orders successfully when user is logged in', async () => {
    const mockOrders = [{ id: '1', customer: { name: 'John Doe' }, products: [] }];
    mockGetOrders.mockResolvedValue(mockOrders);
    mockUseSession.mockReturnValue({ user: { id: '1' } });

    const { result, waitForNextUpdate } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.error).toBeNull();
    expect(mockGetOrders).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch orders error', async () => {
    mockGetOrders.mockRejectedValue(new Error('Failed to fetch orders'));
    mockUseSession.mockReturnValue({ user: { id: '1' } });

    const { result, waitForNextUpdate } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch orders. Please try again later.');
  });


  it('should not fetch orders if user is not logged in', () => {
    mockUseSession.mockReturnValue({ user: null });

    renderHook(() => useOrders());

    expect(mockGetOrders).not.toHaveBeenCalled();
  });
});
