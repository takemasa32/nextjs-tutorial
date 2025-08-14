// jest.polyfills.js
const { TextEncoder, TextDecoder } = require("util");

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

// Fetch API polyfill
const { setupServer } = require("msw/node");
global.fetch = require("node-fetch");
