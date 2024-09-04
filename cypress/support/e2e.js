/// <reference types="cypress" />

import { Helper } from '../page-objects/helper';
import './commands'
import 'cypress-file-upload'

const helper = new Helper();

beforeEach(() => {
    cy.visit('/')
    cy.wait(2000)
})
afterEach(() => {
    helper.capturaTela(Math.floor(Math.random() * 10000));
});