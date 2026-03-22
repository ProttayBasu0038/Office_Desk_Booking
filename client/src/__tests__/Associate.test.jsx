import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Associate from "../pages/Associate";
import { vi } from "vitest";

// Mock the API
vi.mock("../api/adminapi", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { name: "John Doe", utilization: 90 },
          { name: "Jane Smith", utilization: 75 },
        ],
      }),
    ),
  },
}));

vi.mock("recharts", () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe("Associate Component", () => {
  
  test("displays chart with associate data", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Associate />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const chart = screen.queryByTestId("bar-chart");
      expect(chart).toBeTruthy();
    });
  });

  test("has search/filter functionality", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Associate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const searchInput = screen.queryByPlaceholderText(/search|filter/i);
    expect(searchInput).toBeTruthy();
  });
});
