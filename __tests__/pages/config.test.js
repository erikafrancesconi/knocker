import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import { ToastProvider } from "react-toast-notifications";

import Configurations from "pages/config";

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
