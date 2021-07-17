import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import { ToastProvider } from "react-toast-notifications";

import Table from "components/Table";

test("renders correctly", async () => {
  render(
    <ToastProvider>
      <Table />
    </ToastProvider>
  );
});
