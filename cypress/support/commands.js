/// <reference types="cypress" />

// ------------------- IMPORTS ------------------- //
import dayjs from 'dayjs';
import businessDays from 'dayjs-business-days';
// ------------------- FIM IMPORTS ------------------- //

// ------------------- COMANDOS PARA DATAS ------------------- //
dayjs.extend(businessDays); // Extende dayjs com o plugin businessDays

export function getNextBusinessDay(daysToAdd = 1) { // Função para calcular o próximo dia útil
  return dayjs().businessDaysAdd(daysToAdd).format('DD/MM/YYYY'); // Adiciona 1 dia útil
}

export function api_getDiaUtilAnterior() {
  let dataAnterior = dayjs().subtract(1, 'day');

  while (!dataAnterior.isBusinessDay()) {
    dataAnterior = dataAnterior.subtract(1, 'day');
  }
  return dataAnterior.format('YYYY-MM-DDT00:00:00');
}
// ------------------- FIM COMANDOS PARA DATAS ------------------- //

// ------------------- SELECT - BD ------------------- //
const query = `
        SELECT  V.NOME_FAKE,
                V.COD_ATT_FAKE,
                V.STATUS_FAKE,
                V.DATA_FAKE
         FROM VIEW_ATENDIMENTO V
         WHERE V.STATUS_FAKE = 'P'
            AND V.DATA_FAKE IS NOT NULL
            ORDER BY V.DATA_FAKE DESC
        FETCH FIRST 1 ROW ONLY`;
// ------------------- FRIM SELECT - BD ------------------- //

// ------------------- COMANDOS FRONT-END  ------------------- //
Cypress.Commands.add('pesquisaReembolso', () => {
  cy.visit('#/test/processos/cadastrar');

  // Executa a consulta no banco de dados e armazena o resultado em um alias chamado 'resultadoDoBanco'
  pegarDadosViaBanco(query, true, 'resultadoDoBanco');

  // Acessa o alias 'resultadoDoBanco' e utiliza o valor da consulta para inserir no campo de texto
  cy.get('@resultadoDoBanco').then(resultado => {
    expect(resultado).to.exist;

    // Insere o código da ordem de serviço no campo de input com nome "txtOs"
    cy.get('input[name="txtOs"]')
      .invoke('attr', 'type', 'password')
      .type(`${resultado.COD_ATT_FAKE}`, { log: false });

    cy.contains('Pesquisar')
      .click();

    cy.get('#primeiroDadoFake')
      .click();
  });
})

Cypress.Commands.add('funcaoDiaUtilAnterior', () => {
  const previousBusinessDay = getNextBusinessDay(-1);

  cy.get('')
    .invoke('attr', 'type', 'password')
    .type(previousBusinessDay, { delay: 0 });
})

Cypress.Commands.add('funcaoproximoDiaUtil', () => {
  // Calcula o próximo dia útil
  const previousBusinessDay = getNextBusinessDay();

  cy.get(``)
    .should('be.visible')
    .clear() // Limpa o campo antes de inserir a nova data (necessário para conseguir digitar a data)
    .type(previousBusinessDay, { delay: 0 }); // Insere a próxima data útil instantaneamente (precisa ser assim)
})

// ------------------- FIM COMANDOS FRONT-END  ------------------- //

// ACESAR O BANCO DE DADOS
/**
 * Executa uma consulta SQL no banco de dados e armazena o resultado em um alias para uso posterior no teste.
 *
 * @param {string} query - A string contendo a consulta SQL que será executada (por exemplo, "SELECT * FROM ...").
 * @param {boolean} [umValorApenas=true] - Indica se a consulta deve retornar apenas uma linha/valor (true) ou múltiplas linhas/valores (false).
 * @param {string} alias - O nome do alias que será utilizado para armazenar e referenciar o resultado da consulta nos testes subsequentes.
 */
export function pegarDadosViaBanco(query, umValorApenas = true, alias) {
  // Ler as credenciais do arquivo no beforeEach e passar no momento da task
  cy.readFile(Cypress.env('caminhoCredenciais'), 'utf8').then(credenciais => {
    const config = credenciais; // Não é necessário aplicar JSON.parse

    if (umValorApenas) {
      cy.task('executeDbStatement', { statement: query, credenciais: config }, { log: false }).then(result => {
        cy.wrap(result.rows[0]).as(alias); // Armazena a primeira linha do resultado no alias fornecido
      });
    } else {
      cy.task('executeDbStatement', { statement: query, credenciais: config }, { log: false }).then(result => {
        cy.wrap(result.rows).as(alias); // Armazena todas as linhas do resultado no alias fornecido
      });
    }
  });
}
//----------------------------------------------------------------------------------------------------------------------------