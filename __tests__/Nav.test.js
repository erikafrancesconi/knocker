import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import Nav from "components/Nav";

test("renders correctly", async () => {
  render(<Nav />);
});
