angular.module('budget.marcadores', [])
.controller('MarcadoresCtrl', function($scope, $ionicModal, $ionicPopup, daoFactory) {
    $scope.selection = {};
    
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.marcadores.sync();
    
    $scope.$on('$ionicView.enter', function() {
        $ionicModal.fromTemplateUrl('./app/views/marcadores/cadastro.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });
        
    $scope.$on('$ionicView.leave', function() {
        $scope.modal.remove();
    });
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.newItem = function() {
        $scope.selection = {};
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.selection = HashMap.cloneObject($scope.menu.selectedItem);
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
        $scope.marcadores.refresh();
        $scope.modal.hide();
    }
});