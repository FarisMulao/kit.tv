// cypress.config.ts
import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    supportFile: "cypress/support/component.ts",
  },

  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config })
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
