angular.module('budget.marcadores', [])
.controller('MarcadoresCtrl', function($scope, $ionicModal, $ionicPopup, daoFactory) {
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

    $scope.newItem = function() {
        $scope.selection = {};
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.selection = $scope.marcadores.cloneObject($scope.menu.selectedItem);
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-positive',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este marcador?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.marcadores.delete($scope.menu.selectedItem);
                $scope.marcadores.post();
            }
        });
    }
    
    $scope.saveItem = function(item) {
        $scope.marcadores.save(item);
        $scope.marcadores.post();
        $scope.modal.hide();
    }
});