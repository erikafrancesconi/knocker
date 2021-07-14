import { test } from "@jest/globals";
import { render } from "@testing-library/react";
import Layout from "components/Layout";

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
  render(<Layout />);
});
