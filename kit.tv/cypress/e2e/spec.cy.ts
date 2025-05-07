import cypressConfig from "@/cypress.config";
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

    it('should redirect to sign in page when I try to view a dashboard page', () => {
      cy.visit('http://localhost:3000/u/test2');
      cy.url().should('include', '/sign-in');
    });

    it('should allow viewing other user stream pages when not signed in', () => {
      cy.visit('http://localhost:3000/test2');
      cy.get('[data-cy="stream-player-info"]').should('exist');
    });

    it ('should redirect to sign in page when I try to follow a streamer', () => {
      cy.visit('http://localhost:3000/test2');
      cy.get('[data-cy="stream-player-follow-button"]').should('exist');
      cy.get('[data-cy="stream-player-follow-button"]').click();
      cy.url().should('include', '/sign-in');
    });

    it ('should not render any button cards when not signed in', () => {
      cy.visit('http://localhost:3000/test2');
      cy.get('[data-cy="chat-button-meow"]').should('not.exist');
    });

    it ('should allow me to search for a streamer', () => {
      cy.visit('http://localhost:3000');
      cy.get('[data-cy="search-input"]').type('test2');
      cy.get('[data-cy="search-button"]').click();
      cy.get('[data-cy="stream-card-test2"]').should('exist');
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

    it('should allow me to visit my own dashboard page', () => { 
      cy.visit('http://localhost:3000/u/test2');
      cy.get('[data-cy="events-panel"]').should('exist');
    });

    it('should not allow me to visit other user dashboard page', () => {
      cy.visit('http://localhost:3000/u/troat');
      cy.get('[data-cy="events-panel"]').should('not.exist');
    });

    it('should allow me to follow and unfollow a streamer', () => {
      cy.visit('http://localhost:3000/bloat');
      cy.get('[data-cy="stream-player-follow-button"]').should('exist');
      cy.get('[data-cy="stream-player-follow-button"]').click();
      cy.url().should('include', '/bloat');
    });
  });

  context('When I am signed in and on my dashboard page', () => {
    beforeEach(() => {
      setupClerkTestingToken();
      cy.visit('http://localhost:3000');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'test2+clerk_test@example.com' });
      cy.visit('http://localhost:3000/');
    })

    it('should allow me to create a new button', () => {
      cy.visit('http://localhost:3000/u/test2/chat');
      cy.get('[data-cy="chat-page"]').should('exist');
      cy.get('[data-cy="create-button-button"]').should('exist');
      cy.get('[data-cy="create-button-button"]').click();
      cy.get('[data-cy="create-button-dialog-title"]').should('exist');
      cy.get('[data-cy="create-button-dialog-text"]').should('exist');
      cy.get('[data-cy="create-button-dialog-text-input"]').type('TestButtonText');
      cy.get('[data-cy="create-button-dialog-instructions"]').should('exist');
      cy.get('[data-cy="create-button-dialog-instructions-input"]').type('Test Button Instructions');
      cy.get('[data-cy="create-button-dialog-color"]').should('exist');
      cy.get('[data-cy="create-button-dialog-sound"]').should('exist');
      cy.get('[data-cy="create-button-dialog-button"]').click();

      cy.get('[data-cy="button-card-TestButtonText"]').should('exist');
    });
  });
});