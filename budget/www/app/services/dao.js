angular.module('budget.dao', ['ionic', 'budget.syncSDB'])

.factory('daoFactory', function(SyncSDB) {
	var db = new DbFactory(DbProxies.LOCALSTORAGE, 'budget', new SyncSDB()),
		marcadores = db.dataset('marcadores'),
		despesas = db.dataset('despesas'),
		pagamentos = db.dataset('pagamentos');
	
	return {
		getMarcadores: function() {
			return marcadores.open();
		},
		getDespesas: function() {
			return despesas.open();
		},
		getPagamentos: function() {
			return pagamentos.open();
		}
	}
});