angular.module('controllers.trilho', ['ionic'])

.controller('TrilhoCtrl', function($scope, $dao, $ionicPopup) {
    $scope.trilhos = $dao.getTrilhos();
    $scope.contatos = $dao.getContatos();
    
    $dao.getCelulas(function(results) {
        $scope.celula = results[0] || undefined;
    });
    
    $scope.atributos = [
        { id: 'attr1', descricao: 'Fez contato 24h' },
        { id: 'attr2', descricao: 'Já foi integrado na célula' },
        { id: 'attr3', descricao: 'Deu testemunho na célula' }
    ];
    
    $scope.countAttr = function(trilhoId) {
        var trilho = $scope.trilhos.getById(trilhoId),
            count = 0;
        if (trilho) {
            count = trilho.atributos.filter(
                function(item) {
                    return item.concluido;
                }).length;
        }
        return count;
    }
    
    $scope.getAttrName = function(attrId) {
        var hashtable = $scope.atributos.map(function(item) {
                return item.id
            }),
            index = hashtable.indexOf(attrId);
        return $scope.atributos[index].descricao;
    }
    
    $scope.newTrilho = function() {
        var celula = $scope.celula,
            attrs = $scope.atributos,
            record, i;
        
        if (!celula || celula.membros.length === 0) {
            return;
        }
        
        $scope.selection = { celulaId: celula.id, atributos: [] };
        
        for (i = 0; i < attrs.length; i++) {
            record = { id: attrs[i].id, concluido: false };
            $scope.selection.atributos.push(record);
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
                okType: 'button-energized',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este trilho?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.trilhos.delete($scope.selection);
                $scope.trilhos.post();
            }
        });
        
        $scope.menu.closeMenu();
    }
    
    $scope.saveItem = function(record) {
        if (record.id) {
            $scope.trilhos.update(record);
        } else {
            $scope.trilhos.insert(record);
        }
        $scope.trilhos.post(function() {
            $scope.form.closeModal();
        });
    }
});