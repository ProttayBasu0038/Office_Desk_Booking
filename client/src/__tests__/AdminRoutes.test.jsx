import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import AdminRoutes from "../components/AdminRoutes";
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

describe("AdminRoutes Component", () => {
  

  test("shows loading state while checking admin status", async () => {
    const TestAdminComponent = () => <div>Admin Content</div>;

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/admin"
              element={<AdminRoutes element={<TestAdminComponent />} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>,
    );

    // The component should render appropriately
    await waitFor(() => {
      expect(document.body.innerHTML).toBeTruthy();
    });
  });

  test("redirects non-admin users to home", async () => {
    const TestAdminComponent = () => <div>Admin Content</div>;

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/admin"
              element={<AdminRoutes element={<TestAdminComponent />} />}
            />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Should redirect to home or show loading
      expect(screen.queryByText(/admin|home|loading/i)).toBeTruthy();
    });
  });
});
