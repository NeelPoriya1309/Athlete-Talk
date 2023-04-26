const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'xpo4ez',
  e2e: {
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});