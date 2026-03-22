import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Register from "../pages/Register";
import { vi } from "vitest";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Register Component", () => {
  test("renders registration form fields", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Choose a strong password"),
    ).toBeInTheDocument();
  });

  test("displays signup heading", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  test("shows error when fields are empty", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole("button", {
      name: /create my account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });
  });

  test("shows terms of service checkbox", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });
});
