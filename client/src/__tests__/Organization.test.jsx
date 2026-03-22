import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Organization from "../pages/Organization";
import { vi } from "vitest";

// Mock the API helper actually used in Organization
vi.mock("../api/adminapi", () => ({
  fetchOrganizationUtilization: vi.fn(() =>
    Promise.resolve({
      data: [
        {
          organization: "Org A",
          totalBookings: 120,
          uniqueUsers: 40,
          utilizationPercent: 75,
          morningCount: 40,
          afternoonCount: 50,
          fullDayCount: 30,
        },
      ],
    }),
  ),
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

describe("Organization Component", () => {
  test("renders organization utilization page", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Organization />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/organization utilization/i)).toBeInTheDocument();
  });

  test("displays organization metrics", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Organization />
        </AuthProvider>
      </BrowserRouter>,
    );

    // Trigger data fetch
    const applyButton = screen.getByRole("button", { name: /apply filter/i });

    // Enter a year so fetchData runs
    const yearInput = screen.getByPlaceholderText("2026");
    fireEvent.change(yearInput, { target: { value: "2026" } });

    fireEvent.click(applyButton);

    await waitFor(() => {
      // These labels can appear in multiple places (card + table header),
      // so use getAllByText instead of getByText
      expect(screen.getAllByText(/organizations/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/total bookings/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/unique users/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/avg utilization/i).length).toBeGreaterThan(0);
    });
  });

  test("displays chart visualization", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Organization />
        </AuthProvider>
      </BrowserRouter>,
    );

    const applyButton = screen.getByRole("button", { name: /apply filter/i });
    const yearInput = screen.getByPlaceholderText("2026");
    fireEvent.change(yearInput, { target: { value: "2026" } });
    fireEvent.click(applyButton);

    await waitFor(() => {
      const chart = screen.queryByTestId("bar-chart");
      expect(chart).toBeTruthy();
    });
  });
});
