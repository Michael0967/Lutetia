const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'electron',
  viewportWidth: 1440,
  viewportHeight: 900,
  defaultCommandTimeout: 1000,
  responseTimeout: 1500,
  env: {
    STORE: 'https://printemps-a-paris.myshopify.com/',
    PASSWORD: 'paris',
    PREVIEW: '175491252572',
    PRODUCT: 'the-3p-fulfilled-snowboard'
  },
  e2e: {
    quietMode: true,
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
