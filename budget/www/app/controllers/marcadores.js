angular.module('budget.marcadores', [])
.controller('MarcadoresCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, daoFactory, utils) {
    $scope.selection = {};
    
    $scope.marcadores = daoFactory.getMarcadores();
    
    utils.initModal('./app/views/marcadores/cadastro.html', $scope);
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.newItem = function() {
        $scope.selection = { usuario: $rootScope.user.id };
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.selection = OjsUtils.cloneObject($scope.menu.selectedItem);
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-calm',
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
        if (!$scope.formbase.$valid) {
            return;
        }
        $scope.marcadores.save(item);
        $scope.marcadores.post();
        $scope.modal.hide();
    }
});