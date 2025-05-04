import { setupClerkTestingToken } from "@clerk/testing/cypress";


describe('template spec', () => {
  it('passes', () => {
    setupClerkTestingToken();

    cy.visit('http://localhost:3000');

    cy.clerkSignIn({ strategy: 'email_code', identifier: 'test2+clerk_test@example.com' });
  })
})