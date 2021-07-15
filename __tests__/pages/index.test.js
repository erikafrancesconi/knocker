import { test } from "@jest/globals";
import { render } from "@testing-library/react";
import ReactDOM from "react-dom";

import { ToastProvider } from "react-toast-notifications";

import Home from "pages/index";

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element) => {
    return element;
  });
});

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "/",
    };
  },
}));

test("renders correctly", async () => {
  render(
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
});
