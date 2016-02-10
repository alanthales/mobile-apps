angular.module('budget.marcadores', [])
.controller('MarcadoresCtrl', function($scope, $ionicModal, daoFactory) {
    $scope.selection = {};
    
    $scope.marcadores = daoFactory.getMarcadores();
    
    $ionicModal.fromTemplateUrl('./app/views/marcadores/cadastro.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.popoverMenu = function(item, event) {
        $scope.selection = $scope.marcadores.cloneObject(item);
        $scope.menu.openMenu(event);
    }

    $scope.novoItem = function() {
        $scope.selection = {};
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.saveItem = function(item) {
        $scope.marcadores.save(item);
        $scope.marcadores.post();
        $scope.modal.hide();
    }
});