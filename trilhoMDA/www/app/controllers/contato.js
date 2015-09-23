angular.module('controllers.contato', ['ionic'])

.controller('ContatoCtrl', function($scope,  $ionicModal) {
    $scope.contatos = db.createDataSet('contatos');
    
    $scope.contatos.open();
    
    $ionicModal.fromTemplateUrl('app/views/contatos/cadastro.html', function(modal) {
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
        if (confirm('Deseja realmente excluir este contato?')) {
            $scope.contatos.delete(item);
            $scope.contatos.post();
        }
    }
    
    $scope.hideModal = function() {
        $scope.formModal.hide();
    }
    
    $scope.saveItem = function(item) {
        if (item.id) {
            $scope.contatos.update(item);
        } else {
            $scope.contatos.insert(item);
        }
        $scope.contatos.post(function() {
            $scope.hideModal();
        });
    }
});
