angular.module('controllers.contatos', ['ionic'])

.controller('ContatosCtrl', function($scope, $dao, $ionicPopup, $ionicLoading) {
    $scope.contatos = $dao.getContatos(function(results) {
        var mesAtual = new Date().getMonth(),
            mesContato;
        
        $scope.aniversariantes = results.filter(function(record) {
            mesContato = new Date(record.datanasc).getMonth();
            return mesContato === mesAtual;
        });
    }, { sort: 'nome' });
    
    $scope.showMenu = function(item, event) {
        $scope.selection = $dao.cloneObject(item);
        $scope.menu.openMenu(event);
//        $state.go('app.contato', { id: item.id });
    }
    
    $scope.newItem = function(e) {
        $scope.selection = {};
        $scope.form.openModal();
    }
    
    $scope.editItem = function() {
        $scope.menu.closeMenu();
        $scope.form.openModal();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
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
                $state.go('app.contatos');
            }
        });
    }
    
    $scope.postContato = function(record, callback) {
        if (record.id) {
            $scope.contatos.update(record);
        } else {
            $scope.contatos.insert(record);
        }
        $scope.contatos.post(function() {
            $scope.contatos.refresh();
            callback();
        });
    }
    
    $scope.saveItem = function(item) {
        if (!item.nome || item.nome.trim() === '') {
            return;
        }
        $scope.postContato(item, function() {
            $scope.form.closeModal();
        });
    }
    
    $scope.import = function() {
        function onSuccess(contact) {
            $ionicLoading.show({
                template: 'Aguarde...'
            });
            
            var name = contact.displayName,
                phone = contact.phoneNumbers ? contact.phoneNumbers[0].value.replace(/\D+/g, '') : null,
                table = $scope.contatos.filter({ nome: name, telefone: phone }),
                contato, alertPopup;

            if (table.length > 0) {
                alertPopup = $ionicPopup.alert({
                    title: 'Atenção',
                    template: 'Já existe um contato com este nome e fone: ' + name + ' - ' + phone,
                    okType: 'button-assertive'
                });

                $ionicLoading.hide();
                alertPopup.then();

                return;
            }
            
            contato = {
                nome: name,
                endereco: contact.addresses ? contact.addresses[0].value : null,
                telefone: phone,
                email: contact.emails ? contact.emails[0].value : null,
                datanasc: contact.birthday
            };
            
            $scope.postContato(contato, function() {
                $ionicLoading.hide();
            });
        }
        
        navigator.contacts.pickContact(onSuccess, function(err) {
            alert(err);
        });
    }
    
    $scope.goDonate = function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(e.target.dataset.action, "_system");
    }
});
