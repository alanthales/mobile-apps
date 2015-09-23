angular.module('controllers.celula', ['ionic'])

.controller('CelulaCtrl', function($scope,  $ionicModal) {
    $scope.membros = db.createDataSet('membros');
    
    $scope.membros.open();
    
    db.select("celula", function(results) {
        $scope.celula = results[0] || {};
    });
    
    $ionicModal.fromTemplateUrl('app/views/celulas/cadastro.html', function(modal) {
        $scope.formModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $scope.editCelula = function() {
        $scope.formModal.show();
    }
    
    $scope.deleteItem = function(item) {
        if (confirm('Deseja realmente excluir este membro?')) {
            $scope.celulas.delete(item);
            $scope.celulas.post();
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
