import { test, expect } from "@jest/globals";
import { render } from "@testing-library/react";

import { useModal } from "hooks/useModal";

const TestComponent = ({ firstContent, secondContent }) => {
  const { openModal, modalContent, appendContent } = useModal();

  const setFirstContent = () => {
    openModal("Title", [firstContent]);
  };
  const setSecondContent = () => {
    appendContent([secondContent]);
  };

  return (
    <div>
      <button data-testid="button1" onClick={setFirstContent}></button>
      <button data-testid="button2" onClick={setSecondContent}></button>
      <div data-testid="content">{modalContent}</div>
    </div>
  );
};

test("appends content correctly", async () => {
  const cmp = render(
    <TestComponent firstContent="test1" secondContent="test2" />
  );
  (await cmp.findByTestId("button1")).click();

  const content = await cmp.findByTestId("content");
  expect(content.textContent).toBe("test1");

  (await cmp.findByTestId("button2")).click();
  expect(content.textContent).toBe("test1test2");
});
