import React from 'react';
import Page from './../../app/(browse)/(home)/page';

// cypress/e2e/home.cy.ts

describe('Home Page', () => {
    it('renders the home heading', () => {
      cy.visit('/');
      cy.contains('h1', 'Home Page').should('be.visible');
    });
  });
  
