// cypress/support/component.ts
import { mount } from 'cypress/react';

// Add `mount` to the global `cy` object
Cypress.Commands.add('mount', mount);

// Optional: import global styles if needed
// import '../../src/styles/globals.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
