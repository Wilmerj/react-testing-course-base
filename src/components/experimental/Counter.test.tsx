
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('debería mostrar el valor inicial', () => {
    render(<Counter />);
    expect(screen.getByText('Contador: 0')).toBeInTheDocument();
  });

  it('debería incrementar el contador al hacer clic', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('Incrementar'));
    expect(screen.getByText('Contador: 1')).toBeInTheDocument();
  });
});
