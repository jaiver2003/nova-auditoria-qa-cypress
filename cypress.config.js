const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://nova.uniautonoma.edu.co',
    viewportWidth: 1366,
    viewportHeight: 768,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on('task', {
        saveJson({ file, data }) {
          fs.writeFileSync(file, JSON.stringify(data, null, 2));
          return null;
        },
      });
    },
  },
});
