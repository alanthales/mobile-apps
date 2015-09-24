angular.module('controllers.contato', ['ionic'])

.controller('ContatoCtrl', function($scope,  $ionicModal, $ionicPopover) {
    console.log($scope);

    $scope.contatos = db.createDataSet('contatos');
    
    $scope.contatos.open();
    
    $scope.showMenu = function(item, e) {
        $scope.selection = item;
        $scope.popover.show(e);
    }
    
    $scope.newItem = function(e) {
        $scope.selection = {};
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.modal.show();
        $scope.popover.hide();
    }
    
    $scope.deleteItem = function() {
        if (confirm('Deseja realmente excluir este contato?')) {
            $scope.contatos.delete($scope.selection);
            $scope.contatos.post();
        }
        $scope.popover.hide();
    }
    
    $scope.saveItem = function(item) {
        if (item.id) {
            $scope.contatos.update(item);
        } else {
            $scope.contatos.insert(item);
        }
        $scope.contatos.post(function() {
            $scope.modal.hide();
        });
    }
});
