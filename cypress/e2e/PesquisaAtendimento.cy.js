/// <reference types="cypress" />

describe('Cadastrar pagamento', () => {

    it('Deve pesquisar o codigo pagamento pendente e cadastra-lo', () => {
        const query = `
        SELECT  V.CODATENDIMENTO
         FROM TABELA_ATENDIMENTO_FAKE V
         WHERE V.STATUSPAGAMENTO_FAKE = 'P'
            AND V.DATREALIZACAO_FAKE IS NOT NULL
            ORDER BY V.DATREALIZACAO_FAKE DESC
        FETCH FIRST 1 ROW ONLY`;

        pegarDadosViaBanco(query, true, 'resultadoDoBanco');

        cy.get('@resultadoDoBanco').then(resultado => {
            expect(resultado).to.exist;

            // insere o valor no input
            cy.get('input[name="txtAtendimento"]').type(`${resultado.CODATENDIMENTO}`);
        });

        cy.contains('Pesquisar').click();
    });
});
