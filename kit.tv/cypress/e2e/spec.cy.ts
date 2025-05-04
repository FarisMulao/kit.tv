import { setupClerkTestingToken } from "@clerk/testing/cypress";


describe('Account Main Page Tests', () => {
  context('When I am not singed in', () => {
    beforeEach(() => {
      setupClerkTestingToken();
    })
    
    it('loads main page as unsigned user', () => {
      cy.visit('http://localhost:3000');

      cy.get('[data-cy="log-in-button"]').should('exist');
      cy.get('[data-cy="dashboard-link"]').should('not.exist');
    });

    it('should redirect to sign in page when I try to view a stream page', () => {
      cy.visit('http://localhost:3000/test2');
      cy.url().should('include', '/sign-in');
    });

    it('should redirect to sign in page when I try to view a dashboard page', () => {
      cy.visit('http://localhost:3000/u/test2');
      cy.url().should('include', '/sign-in');
    });
  });

  context('When I am signed in', () => {
    beforeEach(() => {
      setupClerkTestingToken();
      cy.visit('http://localhost:3000');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'test2+clerk_test@example.com' });
    })

    it('loads main page as signed in user', () => { 
      cy.visit('http://localhost:3000');

      cy.get('[data-cy="log-in-button"]').should('not.exist');
      cy.get('[data-cy="dashboard-link"]').should('exist');
    });

    it('should allow me to view a stream page', () => {
      cy.visit('http://localhost:3000/test2');
      cy.get('[data-cy="username-field"]').should('exist');
    });

    it('should allow me to visit my own dashboard page', () => { 
      cy.visit('http://localhost:3000/u/test2');
      cy.get('[data-cy="creator-page-title"]').should('exist');
    });
  });
});