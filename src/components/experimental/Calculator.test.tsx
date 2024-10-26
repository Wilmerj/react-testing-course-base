import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Calculator } from "./Calculator";

describe("Calculator", () => {
  const useCasesTest = [
    { a: 1, b: 2, operation: "add", expected: 3 },
    { a: 5, b: 3, operation: "subtract", expected: 2 },
    { a: 4, b: 2, operation: "multiply", expected: 8 },
    { a: 8, b: 2, operation: "divide", expected: 4 },
    { a: 8, b: 0, operation: "divide", expected: "Error" },
  ];
  it.each(useCasesTest)(
    "should return $expected for $operation operation with $a and $b",
    ({ a, b, operation, expected }) => {
      render(<Calculator a={a} b={b} operation={operation} />);
      const result = screen.getByText(`Result: ${expected}`);
      expect(result).toBeInTheDocument();
    }
  );
});
