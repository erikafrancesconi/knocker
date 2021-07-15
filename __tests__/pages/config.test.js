import { test } from "@jest/globals";
import { render } from "@testing-library/react";
import ReactDOM from "react-dom";

import { ToastProvider } from "react-toast-notifications";

import Configurations from "pages/config";

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element) => {
    return element;
  });
});

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/config",
      pathname: "",
      query: "",
      asPath: "/config",
    };
  },
}));

test("renders correctly", async () => {
  render(
    <ToastProvider>
      <Configurations />
    </ToastProvider>
  );
});
