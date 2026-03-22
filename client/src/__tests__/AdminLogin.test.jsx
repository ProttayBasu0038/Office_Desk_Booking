import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import AdminLogin from "../pages/AdminLogin";
import { vi } from "vitest";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("AdminLogin Component", () => {
  test("renders admin login form", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/admin email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("displays admin portal heading", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /admin portal/i }),
    ).toBeInTheDocument();
  });

  test("has login button", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </BrowserRouter>,
    );

    const loginButton = screen.getByRole("button", { name: /sign in/i });
    expect(loginButton).toBeInTheDocument();
  });
});
