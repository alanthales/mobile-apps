angular.module('controllers.celula', ['ionic'])

.controller('CelulaCtrl', function($scope,  $ionicModal) {
    console.log($scope);
    
    $scope.membros = db.createDataSet('membros');
    
    $scope.membros.open();
    
    $scope.celulas = db.createDataSet('celulas');
    
    $scope.celulas.open(function(results) {
        $scope.celula = results[0] || {};
    });
    
    db.select("contatos", null, function(results) {
        $scope.contatos = results;
    });
    
    $scope.dias = [
        { id: 0, nome: 'Domingo' },
        { id: 1, nome: 'Segunda' },
        { id: 2, nome: 'Terça' },
        { id: 3, nome: 'Quarta' },
        { id: 4, nome: 'Quinta' },
        { id: 5, nome: 'Sexta' },
        { id: 6, nome: 'Sábado' }
    ];
    
    $scope.regCelula = function() {
        $scope.modal.show();
    }
    
    $scope.addMembro = function(e) {
        $scope.popover.show(e);
    }
    
    $scope.deleteItem = function(item) {
        if (confirm('Deseja realmente excluir este membro?')) {
            $scope.celulas.delete(item);
            $scope.celulas.post();
        }
    }
    
    $scope.hideModal = function() {
        $scope.modal.hide();
    }
    
    $scope.saveCelula = function(celula) {
        if (celula.id) {
            $scope.celulas.update(celula);
        } else {
            $scope.celulas.insert(celula);
        }
        $scope.celulas.post(function() {
            $scope.hideModal();
        });
    }
});
