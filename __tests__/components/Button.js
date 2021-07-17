import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import Button from "components/Button";

test("renders correctly", async () => {
  render(<Button />);
});
