angular.module('offersapp')
.controller('SideMenuCtrl', function($scope, $state, $ionicSideMenuDelegate, categorias, lista) {
	this.categorias = categorias;
	this.lista = lista;
	
	this.goTo = function(opts) {
		if (opts && typeof opts === 'object') {
			$state.go('app.category', { id: opts.id });
		} else {
			$state.go(opts);
		}
		$ionicSideMenuDelegate.toggleLeft();
	};
});