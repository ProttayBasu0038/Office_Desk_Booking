import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

describe("Login Component", () => {
  test("renders email and password fields", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
  });
});
