angular.module('budget.dao', ['ionic'])

.factory('daoFactory', function() {
    var db = db = new DbFactory('budget', DbProxies.LOCALSTORAGE),
        marcadores = db.createDataSet('marcadores'),
        despesas = db.createDataSet('despesas');
    
    despesas.sortBy = 'data desc';
    
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
        }
    }
});