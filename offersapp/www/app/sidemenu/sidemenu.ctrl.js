angular.module('offersapp')
.controller('SideMenuCtrl', function($scope, $state, DaoFact){
    this.categorias = DaoFact.getCategorias();
    
    this.goTo = function(params) {
        if (params && typeof params === 'object') {
            return $state.go('app.category', params);
        }
        $state.go(params);
    };
});