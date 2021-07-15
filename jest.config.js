module.exports = {
  moduleNameMapper: {
    "^components(.*)$": "<rootDir>/components$1",
    "^pages(.*)$": "<rootDir>/pages$1",
    "^hooks(.*)$": "<rootDir>/hooks$1",
    "^utils(.*)$": "<rootDir>/utils$1",
    "^db(.*)$": "<rootDir>/db$1",
  },
  testEnvironment: "jsdom",
};
