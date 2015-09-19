angular.module('controllers.celula', ['ionic'])

.controller('CelulaCtrl', function($scope,  $ionicModal) {
    $scope.celulas = db.createDataSet('celulas');
    
    $scope.celulas.open();
    
    $ionicModal.fromTemplateUrl('app/views/celulas/cadastro.html', function(modal) {
        $scope.formModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $scope.newItem = function() {
        $scope.selection = {};
        $scope.formModal.show();
    }
    
    $scope.editItem = function(item) {
        $scope.selection = item;
        $scope.formModal.show();
    }
    
    $scope.deleteItem = function(item) {
        if (confirm('Deseja realmente excluir esta célula?')) {
            $scope.celulas.delete(item);
        }
    }
    
    $scope.hideModal = function() {
        $scope.formModal.hide();
    }
    
    $scope.saveItem = function(item) {
        if (item.id) {
            $scope.celulas.update(item);
        } else {
            $scope.celulas.insert(item);
        }
        $scope.celulas.post(function() {
            $scope.hideModal();
        });
    }
});
