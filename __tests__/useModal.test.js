import { test, expect } from "@jest/globals";
import { renderHook, act } from "@testing-library/react-hooks";

import { useModal } from "hooks/useModal";

test("appends content correctly with hooks", async () => {
  const { result } = renderHook(() => useModal());
  const { openModal, appendContent } = result.current;

  act(() => openModal("Title", ["test1"]));
  act(() => appendContent(["test2"]));
  expect(result.current.modalContent).toEqual(["test1", "test2"]);
});
