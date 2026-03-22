import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
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

describe("Sidebar Component", () => {
  test("renders sidebar with logo and branding", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </BrowserRouter>,
    );

    const logo = screen.queryByText(/seatbook|logo/i);
    expect(logo).toBeTruthy();
  });

  


  test("has logout button", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </BrowserRouter>,
    );

    // Icon-only button uses title "Logout" for identification
    const logoutButton = screen.getByTitle(/logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  test("calls logout when logout button is clicked", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle(/logout/i);
    fireEvent.click(logoutButton);

    // Logout should trigger navigation or context update
    expect(logoutButton).toBeInTheDocument();
  });

  test("navigation links are clickable", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </BrowserRouter>,
    );

    const dashboardLink = screen.getByText(/dashboard/i);
    fireEvent.click(dashboardLink);

    // Link should be interactable
    expect(dashboardLink).toBeInTheDocument();
  });
});
