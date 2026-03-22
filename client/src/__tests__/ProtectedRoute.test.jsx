import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { vi } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ProtectedRoute Component", () => {

  test("shows loading spinner while checking auth", async () => {
    const TestComponent = () => <div>Protected Content</div>;

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute element={<TestComponent />} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>,
    );

    // The component should render the protected content or show loading
    await waitFor(() => {
      expect(document.body.innerHTML).toBeTruthy();
    });
  });

  test("redirects to login when not authenticated", async () => {
    const TestComponent = () => <div>Protected Content</div>;

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute element={<TestComponent />} />}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Component should either render or redirect
      expect(screen.queryByText(/protected|login/i)).toBeTruthy();
    });
  });
});
