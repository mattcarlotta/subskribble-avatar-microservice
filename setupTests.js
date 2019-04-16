jest.mock("fs");

expect.extend({
  toBeNullOrType: (received, type) => ({
    message: () => `expected ${received} to be null or ${type}`,
    pass: received === null || typeof received === type,
  }),
});
