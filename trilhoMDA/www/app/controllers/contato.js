angular.module('controllers.contato', ['ionic'])

.controller('ContatoCtrl', function($scope,  $ionicModal) {
    $scope.contatos = db.createDataSet('contatos');
    
    $scope.contatos.open();
    
    $ionicModal.fromTemplateUrl('app/views/contatos/cadastro.html', function(modal) {
        $scope.contatoModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $scope.newItem = function() {
        $scope.selection = {};
        $scope.contatoModal.show();
    }
    
    $scope.editItem = function(contato) {
        $scope.selection = contato;
        $scope.contatoModal.show();
    }
    
    $scope.deleteItem = function(contato) {
        if (confirm('Deseja realmente excluir este item?')) {
            $scope.contatos.delete(contato);
        }
    }
    
    $scope.hideModal = function() {
        $scope.contatoModal.hide();
    }
    
    $scope.saveContato = function(contato) {
        if (contato.id) {
            $scope.contatos.update(contato);
        } else {
            $scope.contatos.insert(contato);
        }
        $scope.contatos.post(function() {
            $scope.hideModal();
        });
    }
});
