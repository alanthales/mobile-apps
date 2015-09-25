angular.module('controllers.contato', ['ionic'])

.controller('ContatoCtrl', function($scope) {
    $scope.contatos = db.createDataSet('contatos');
    
    $scope.contatos.open();
    
    $scope.showMenu = function(item, e) {
        $scope.selection = item;
        $scope.menu.openMenu(e);
    }
    
    $scope.newItem = function(e) {
        $scope.selection = {};
        $scope.form.openModal();
    }
    
    $scope.editItem = function() {
        $scope.form.openModal();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        if (confirm('Deseja realmente excluir este contato?')) {
            $scope.contatos.delete($scope.selection);
            $scope.contatos.post();
        }
        $scope.menu.closeMenu();
    }
    
    $scope.saveItem = function(item) {
        if (item.id) {
            $scope.contatos.update(item);
        } else {
            $scope.contatos.insert(item);
        }
        $scope.contatos.post(function() {
            $scope.form.closeModal();
        });
    }
});
