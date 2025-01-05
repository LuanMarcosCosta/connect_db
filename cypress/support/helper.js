//Geração de screenshots para relatório de teste automatizado
let prevNome = [];
Cypress.Commands.add('capturaTela', (nome) => {
    cy.screenshot(nome.toString(), {
        capture: 'runner'
    }).then(() => {
        Cypress.on('test:after:run', (test) => {
            if (!prevNome.includes(nome)) {
                addContext({
                    test
                }, {
                    title: 'Captura de tela: ',
                    value: `http://qa.fake-api.com.br/relatorios/pasta-de-relatorios/${Cypress.spec.name}/${nome}.png`
                });
                prevNome.push(nome);
            }
        })
    })
});
//------------------------------------------------
 
//Limpeza de XHR e Fetch do relatório
Cypress.Commands.add('limpaRelatorio', () => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
});
//------------------------------------------------