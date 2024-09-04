const { defineConfig } = require('cypress');
const { loadDBPlugin } = require('./cypress/plugin/conectaBanco');

module.exports = defineConfig({
  video: false,
  watchForFileChanges: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  responseTimeout: 20000,
  defaultCommandTimeout: 20000,
  caminhoCredenciais: '/var/credenciais/credenciais.json',
  e2e: {
    chromeWebSecurity: false,
    setupNodeEvents(on) {
      on('task', loadDBPlugin());
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    baseUrl: 'google.com.br',
  },
});
