angular.module('offersapp')
.controller('SideMenuCtrl', function($scope, $state, $ionicSideMenuDelegate, categorias, lista) {
	this.categorias = categorias;
	this.lista = lista;
	
	this.goTo = function(opts) {
		$ionicSideMenuDelegate.toggleLeft();

		if (opts && typeof opts === 'object') {
			return $state.go('app.category', { id: opts.id });
		}

		$state.go(opts);
	};
});