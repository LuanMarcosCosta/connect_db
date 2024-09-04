const fs = require('fs');
const oracledb = require('oracledb');

let _connection;

const DbPluginUtil = {
    async setupDb() {
        // Carregue o arquivo JSON
        const config = JSON.parse(fs.readFileSync('/var/credenciais/credenciais.json', 'utf8'));
        const dbConfig = config.conexaoBDOracle;
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        oracledb.autoCommit = true;

        oracledb.initOracleClient({ configDir: dbConfig.TNS_ADMIN_LOCATION });
        _connection = await oracledb.getConnection({
            user: dbConfig.DB_USER,
            password: dbConfig.DB_PASSWORD,
            connectString: dbConfig.DB_CONNECT_STRING
        });

        return null;
    },

    async testConnection() {
        if (!_connection) {
            await this.setupDb();
        }
    },

    async executeDbStatement(statement) {
        await this.testConnection();
        try {
            return await _connection.execute(statement);
        } catch (e) {
            throw new Error('failed to execute: ' + statement + '\n' + e.message);
        }
    },
}

Object.freeze(DbPluginUtil);

function loadDBPlugin() {
    return {
        async executeDbStatement({ statement }) {
            return await DbPluginUtil.executeDbStatement(statement);
        },
    }
}

module.exports = {
    loadDBPlugin
}
