import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import MobileNav from "components/nav/MobileNav";

test("renders correctly", async () => {
  render(<MobileNav />);
});
