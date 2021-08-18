import { test } from "@jest/globals";
import { render } from "@testing-library/react";
import { ConfigRow } from "components";
import { Table, Tbody } from "@chakra-ui/react";

test("renders correctly", async () => {
  render(
    <Table>
      <Tbody>
        <ConfigRow />
      </Tbody>
    </Table>
  );
});
