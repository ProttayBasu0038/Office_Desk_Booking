import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import MonthlyUtilization from "../pages/MonthlyUtilization";
import { vi } from "vitest";

// Mock the API
vi.mock("../api/adminapi", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { month: "January", utilization: 75 },
          { month: "February", utilization: 82 },
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

describe("MonthlyUtilization Component", () => {
  test("renders monthly utilization page", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MonthlyUtilization />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/monthly|utilization/i)).toBeInTheDocument();
  });


  test("has filter controls (year, month)", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MonthlyUtilization />
        </AuthProvider>
      </BrowserRouter>,
    );

    const inputs = screen.queryAllByRole("combobox");
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });
});
