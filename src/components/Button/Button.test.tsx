import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button Component", () => {
  it("renders with the correct label", () => {
    render(<Button label="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("has the correct default type", () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("can have a custom type", () => {
    render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
