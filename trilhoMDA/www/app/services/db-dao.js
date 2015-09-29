angular.module('db.dao', ['ionic'])

.factory('$dao', function() {
    var contatos = db.createDataSet('contatos'),
        celulas = db.createDataSet('celulas'),
        chamadas = db.createDataSet('chamadas');
    
    return {
        getContatos: function(callback) {
            contatos.open(callback);
            return contatos;
        },
        getCelulas: function(callback) {
            celulas.open(callback);
            return celulas;
        },
        getChamadas: function(callback) {
            chamadas.open(callback);
            return chamadas;
        }
    }
});