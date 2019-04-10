jest.mock('fs');

expect.extend({
  toBeNullOrType: (received, type) => ({
    message: () => `expected ${received} to be null or ${type}`,
    pass: received === null || typeof received === type,
  }),
});

// global.getCookie = require("./utils/getCookie");
global.db = require('./database/db');
global.app = require('./utils/setup');
