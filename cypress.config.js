const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://api-homologacao.getnet.com.br",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
