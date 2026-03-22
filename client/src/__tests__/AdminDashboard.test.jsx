import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";
import { vi } from "vitest";

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("AdminDashboard Component", () => {
  test("renders admin dashboard", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/admin|dashboard/i)).toBeInTheDocument();
  });

  test("renders sidebar with navigation", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  test("has logout button", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>,
    );

    const logoutButton = screen.queryByRole("button", {
      name: /logout|sign out/i,
    });
    expect(logoutButton).toBeTruthy();
  });
});
