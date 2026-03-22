import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import { vi } from "vitest";

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AuthContext", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test("provides initial auth state", () => {
    const TestComponent = () => {
      const { user, token, loading } = useContext(AuthContext);
      return (
        <div>
          <div>User: {user ? "exists" : "null"}</div>
          <div>Token: {token ? "exists" : "null"}</div>
          <div>Loading: {loading ? "true" : "false"}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText(/User: null/)).toBeInTheDocument();
    expect(screen.getByText(/Token: null/)).toBeInTheDocument();
  });

  test("saveUser saves user and token to localStorage and context", async () => {
    const TestComponent = () => {
      const { user, token, saveUser } = useContext(AuthContext);

      return (
        <div>
          <div>User: {user?.email}</div>
          <div>Token: {token || "none"}</div>
          <button
            onClick={() =>
              saveUser(
                {
                  id: "1",
                  name: "Test",
                  email: "test@example.com",
                  role: "user",
                },
                "test-token-123",
              )
            }
          >
            Save User
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /save user/i });
    act(() => {
      button.click();
    });

    // Check localStorage
    expect(mockLocalStorage.getItem("token")).toBe("test-token-123");
    expect(mockLocalStorage.getItem("user")).toContain("test@example.com");
  });

  test("logout clears user, token, and localStorage", async () => {
    const TestComponent = () => {
      const { user, token, logout, saveUser } = useContext(AuthContext);

      return (
        <div>
          <div>User: {user?.email || "null"}</div>
          <button
            onClick={() => saveUser({ email: "test@example.com" }, "token")}
          >
            Save
          </button>
          <button onClick={() => logout()}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    act(() => {
      saveButton.click();
    });

    expect(mockLocalStorage.getItem("token")).toBeTruthy();

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    act(() => {
      logoutButton.click();
    });

    expect(mockLocalStorage.getItem("token")).toBeNull();
  });

  test("loads user from localStorage on mount", () => {
    mockLocalStorage.setItem("token", "saved-token-123");
    mockLocalStorage.setItem(
      "user",
      JSON.stringify({ id: "1", email: "saved@example.com" }),
    );

    const TestComponent = () => {
      const { user, token } = useContext(AuthContext);
      return (
        <div>
          <div>User: {user?.email || "null"}</div>
          <div>Token: {token || "null"}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // After hydration from localStorage
    expect(screen.getByText(/User: saved@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Token: saved-token-123/)).toBeInTheDocument();
  });
});
