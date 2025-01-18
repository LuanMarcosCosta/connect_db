/// <reference types="cypress" />

import './commands';
import './helper';
import 'cypress-file-upload';

beforeEach(() => {
    cy.visit('#/test');
    cy.limpaRelatorio()
})
afterEach(() => {
    const screenshotName = Math.floor(Math.random() * 1000000);
    cy.capturaTela(screenshotName);
});