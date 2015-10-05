angular.module('controllers.contato', ['ionic'])

.controller('ContatoCtrl', function($scope, $dao, $ionicPopup) {
    $scope.contatos = $dao.getContatos(function(results) {
        var mesAtual = new Date().getMonth(),
            mesContato;
        
        $scope.aniversariantes = results.filter(function(record) {
            mesContato = new Date(record.datanasc).getMonth();
            return mesContato === mesAtual;
        });
    }, { sort: 'nome' });
    
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
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-assertive',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este contato?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.contatos.delete($scope.selection);
                $scope.contatos.post();
            }
        });
        
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
    
    $scope.import = function() {
        function onSuccess(contact) {
            var contato = {
                nome: contact.displayName,
                endereco: contact.addresses ? contact.addresses[0].value : null,
                telefone: contact.phoneNumbers ? contact.phoneNumbers[0].value.replace(/\D+/g, '') : null,
                email: contact.emails ? contact.emails[0].value : null,
                datanasc: contact.birthday ? new Date(contact.birthday) : null
            };
            $scope.saveItem(contato);
        }
        
        navigator.contacts.pickContact(onSuccess, function(err) {
            alert(err);
        });
    }
});
