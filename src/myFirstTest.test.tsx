import { describe, it, expect } from 'vitest'

describe('Mi primer test', () => {
  it('debería sumar dos números correctamente', () => {
    const suma = (a, b) => a + b;
    const resultado = suma(2, 3)
    expect(resultado).toBe(5);
  });

  it('debería verificar que dos textos sean iguales', () => {
    const texto1 = 'Platzi conf';
    const texto2 = 'Platzi conf';
    expect(texto1).toBe(texto2);
  });
});