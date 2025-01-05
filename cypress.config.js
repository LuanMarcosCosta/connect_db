const { defineConfig } = require('cypress');
const { loadDBPlugin } = require('./cypress/plugin/conectaBanco');

module.exports = defineConfig({
  video: false,
  responseTimeout: 60000,
  defaultCommandTimeout: 60000,
  watchForFileChanges: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotsFolder: '/report-e2e/report/cypress/nome-pasta-teste',
  env: {
    token: '',
    caminhoCredenciais: '/credenciais/credenciais.json',
  },
  e2e: {
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron' && browser.isHeadless) {
          launchOptions.preferences.width = 1920;
          launchOptions.preferences.height = 1080;
        }
        return launchOptions;
      });
      // Aqui você apenas passa a função 'loadDBPlugin', sem chamá-la.
      loadDBPlugin(on);
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    baseUrl: 'https://sua-url-base.com.br/',
    specPattern: 'tests/*.test.js',
    experimentalRunAllSpecs: true
  },
});
