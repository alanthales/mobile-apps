angular.module('budget.dao', ['ionic', 'budget.syncSDB'])

.factory('daoFactory', function(SyncSDB) {
    var db = new DbFactory(DbProxies.LOCALSTORAGE, 'budget', new SyncSDB()),
        marcadores = db.createDataSet('marcadores'),
        despesas = db.createDataSet('despesas'),
        pagamentos = db.createDataSet('pagamentos', IdGenerators.UUID);
    
    marcadores.sort = { descricao: 'asc' };
    
    return {
        getDB: function() {
            return db;
        },
        getMarcadores: function(callback) {
            marcadores.open(callback);
            return marcadores;
        },
        getDespesas: function(callback) {
            despesas.open(callback);
            return despesas;
        },
        getPagamentos: function(callback) {
            pagamentos.open(callback);
            return pagamentos;
        }
    }
});