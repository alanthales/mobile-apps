angular.module('offersapp')
.controller('SideMenuCtrl', function($scope, $state, categorias, lista) {
    this.categorias = categorias;
    this.lista = lista;
    
    this.goTo = function(params) {
        if (params && typeof params === 'object') {
            return $state.go('app.category', params);
        }
        $state.go(params);
    };
});