import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
beforeEach(() => {
  fetch.resetMocks();
});

import ReactDOM from "react-dom";
beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element) => {
    return element;
  });
});
