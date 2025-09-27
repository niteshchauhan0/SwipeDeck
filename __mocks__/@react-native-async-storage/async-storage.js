let storage = {};

const AsyncStorage = {
  setItem: jest.fn((key, value) => {
    storage[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null);
  }),
  removeItem: jest.fn((key) => {
    delete storage[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    storage = {};
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
};

module.exports = AsyncStorage;
