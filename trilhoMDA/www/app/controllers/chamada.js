angular.module('controllers.chamada', ['ionic'])

.controller('ChamadaCtrl', function($scope, $dao, $ionicPopup) {
    $scope.chamadas = $dao.getChamadas();
    $scope.contatos = $dao.getContatos();
    
    $dao.getCelulas(function(results) {
        $scope.celula = results[0] || undefined;
    });
    
    $scope.newChamada = function() {
        var celula = $scope.celula,
            record, i;
        
        if (!celula || celula.membros.length === 0) {
            return;
        }
        
        $scope.selection = { celulaId: celula.id, data: new Date(), membros: [], visitantes: [] };
        
        for (i = 0; i < celula.membros.length; i++) {
            record = { id: celula.membros[i], presente: false };
            $scope.selection.membros.push(record);
        }
        
        $scope.form.openModal();
    }
    
    $scope.showMenu = function(item, e) {
        $scope.selection = item;
        $scope.menu.openMenu(e);
    }
    
    $scope.editItem = function() {
        $scope.form.openModal();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-balanced',
                cancelText: 'Não',
                template: 'Deseja realmente excluir esta chamada?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.chamadas.delete($scope.selection);
                $scope.chamadas.post();
            }
        });
        
        $scope.menu.closeMenu();
    }
    
    $scope.saveItem = function(record) {
        if (record.id) {
            $scope.chamadas.update(record);
        } else {
            $scope.chamadas.insert(record);
        }
        $scope.chamadas.post(function() {
            $scope.form.closeModal();
        });
    }
    
    $scope.addVisitante = function(contato) {
        var index = $scope.selection.visitantes.indexOf(contato.id),
            alertPopup;
        
        if (index !== -1) {
            alertPopup = $ionicPopup.alert({
                title: 'Atenção',
                template: 'Este visitante já foi adicionado',
                okType: 'button-balanced'
            });
            
            alertPopup.then();
            
            return;
        }
        
        $scope.selection.visitantes.push(contato.id);
        $scope.frmVisitante.closeModal();
    }
    
    $scope.deleteVisitante = function(contato) {
        var index = $scope.selection.visitantes.indexOf(contato.id);
        if (index !== -1) {
            $scope.selection.visitantes.splice(index, 1);
        }
    }
});