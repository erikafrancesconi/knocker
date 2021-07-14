import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import Toast from "components/Toast";

test("renders correctly", async () => {
  render(<Toast />);
});
