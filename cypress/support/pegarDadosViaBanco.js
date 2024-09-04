/// <reference types="cypress" />

// Query: A string SQL que será executada no banco de dados "select * from"
// umValorApenas: Um indicador de se você espera apenas uma linha/valor da consulta (Query) ou múltiplas linhas.
// Alias: Um nome de alias que será usado para referenciar o resultado da consulta em outros pontos do teste
export function pegarDadosViaBanco(query, umValorApenas = true, alias) {
    if (umValorApenas) {
        cy.task('executeDbStatement', { statement: query }, {log: false}).then(result => {
            console.log('Executando consulta:', query);
            cy.wrap(result.rows[0]).as(alias);
        });
    } else {
        cy.task('executeDbStatement', { statement: query }, {log: false}).then(result => {
            cy.wrap(result.rows).as(alias);
        });
    }
}