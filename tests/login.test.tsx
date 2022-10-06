import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/login";

describe("Login Tests", () => {
  // Tests rendering the login page.
  it("renders correctly", () => {
    render(<Login />);
  });

  // Tests that username and password fields can be modified.
  it("can modify username and password fields", () => {
    const { container } = render(<Login />);

    // check if adds properly
    const usernameInput = screen.getByTestId(
      "account-username"
    ) as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "account-password"
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "test_user" } });
    fireEvent.change(passwordInput, { target: { value: "abc123" } });

    expect(usernameInput.value).toBe("test_user");
    expect(passwordInput.value).toBe("abc123");
  });

  it("can modify address and port fields", () => {
    const { container } = render(<Login />);

    // check if adds properly
    const addressInput = screen.getByTestId(
      "server-address"
    ) as HTMLInputElement;
    const portInput = screen.getByTestId("server-port") as HTMLInputElement;

    fireEvent.change(addressInput, { target: { value: "localhost" } });
    fireEvent.change(portInput, { target: { value: "50052" } });

    expect(addressInput.value).toBe("localhost");
    expect(portInput.value).toBe("50052");
  });
});
