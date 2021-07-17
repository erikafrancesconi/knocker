import { test } from "@jest/globals";
import { render, act } from "@testing-library/react";

import { ToastProvider } from "react-toast-notifications";

import Home from "pages/index";

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
  fetch.mockResponse(
    JSON.stringify({
      result: `CONTAINER ID   IMAGE                COMMAND                  CREATED       STATUS          PORTS                                       NAMES
  69e1150f1401   postgres:13-alpine   "docker-entrypoint.s…"   10 days ago   Up 39 minutes   0.0.0.0:5438->5432/tcp, :::5438->5432/tcp   knocker_db_1
  `,
    })
  );

  await act(async () =>
    render(
      <ToastProvider>
        <Home />
      </ToastProvider>
    )
  );
});
