import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import DesktopNav from "components/nav/DesktopNav";

test("renders correctly", async () => {
  render(<DesktopNav />);
});
