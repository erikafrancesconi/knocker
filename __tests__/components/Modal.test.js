import { test } from "@jest/globals";
import { render } from "@testing-library/react";

import ReactDOM from "react-dom";

import Modal from "components/Modal";

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element) => {
    return element;
  });
});

test("renders correctly", async () => {
  render(<Modal />);
});
