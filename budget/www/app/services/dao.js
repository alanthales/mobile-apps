angular.module('budget.dao', ['ionic'])

.factory('$dao', function() {
    var db = db = new DbFactory('budget', DbProxies.LOCALSTORAGE),
        marcadores = db.createDataSet('marcadores'),
        despesas = db.createDataSet('despesas');
    
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