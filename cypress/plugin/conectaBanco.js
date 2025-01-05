const oracledb = require('oracledb'); // Importa o módulo oracledb para interagir com o banco de dados Oracle

let _connection; // Variável para armazenar a conexão ativa com o banco de dados Oracle

const DbPluginUtil = {
    // Função para configurar a conexão com o banco de dados usando as credenciais fornecidas
    async setupDb(credenciais) {
        const dbConfig = credenciais.conexaoBDOracle; // Extrai as configurações de conexão do objeto de credenciais

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Define o formato de saída dos resultados da consulta como um objeto
        oracledb.autoCommit = true; // Habilita o autoCommit para confirmar automaticamente as transações

        // Inicializa o cliente Oracle com o diretório de configuração especificado (TNS_ADMIN_LOCATION)
        oracledb.initOracleClient({ configDir: dbConfig.TNS_ADMIN_LOCATION });

        // Estabelece a conexão com o banco de dados usando as credenciais (usuário, senha, string de conexão)
        _connection = await oracledb.getConnection({
            user: dbConfig.DB_USER,
            password: dbConfig.DB_PASSWORD,
            connectString: dbConfig.DB_CONNECT_STRING
        });

        return null; // Retorna null após a configuração (nenhum valor específico precisa ser retornado)
    },

    // Função para testar se a conexão já está ativa, caso contrário, inicializa a conexão
    async testConnection(credenciais) {
        if (!_connection) { // Se a conexão não foi criada ainda (_connection é null ou undefined)
            await this.setupDb(credenciais); // Chama a função de setup para criar a conexão
        }
    },

    // Função para executar uma instrução SQL no banco de dados
    async executeDbStatement(statement, credenciais) {
        await this.testConnection(credenciais); // Garante que a conexão está ativa, se não, faz a conexão
        try {
            // Executa a instrução SQL passada e retorna o resultado
            return await _connection.execute(statement);
        } catch (e) {
            // Em caso de erro, lança uma exceção com a mensagem de erro customizada
            throw new Error('Falha ao executar: ' + statement + '\n' + e.message);
        }
    },
};

// Exporta a função para ser usada como task no Cypress
function loadDBPlugin(on) {
    on('task', {
        // Registra a task que executa uma consulta SQL, recebendo a instrução e as credenciais
        executeDbStatement({ statement, credenciais }) {
            // Chama a função que executa a instrução no banco de dados e retorna o resultado
            return DbPluginUtil.executeDbStatement(statement, credenciais);
        }
    });
}

module.exports = {
    loadDBPlugin // Exporta a função loadDBPlugin para ser utilizada em outros arquivos do projeto
};
