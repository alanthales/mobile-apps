angular.module('controllers.trilho', ['ionic'])

.controller('TrilhoCtrl', function($scope, $dao, $ionicPopup) {
    $scope.trilhos = $dao.getTrilhos();
    $scope.contatos = $dao.getContatos();
    
    $dao.getCelulas(function(results) {
        $scope.celula = results[0] || undefined;
    });
    
    $scope.atributos = [
        { id: 'attr1', descricao: 'Fez contato 24h' },
        { id: 'attr2', descricao: 'Fez a 1° visita do acompanhamento inicial' },
        { id: 'attr3', descricao: 'Já começou o discipulado inicial' },
        { id: 'attr4', descricao: 'Foi integrado na célula' },
        { id: 'attr5', descricao: 'Começou a frequentar o culto de celebração' },
        { id: 'attr6', descricao: 'Conclui o acompanhamento inicial' },
        { id: 'attr7', descricao: 'Fez o pré, encontro e pós-encontro' },
        { id: 'attr8', descricao: 'Fez o curso de membresia' },
        { id: 'attr9', descricao: 'Já fez entrevista pré-batismo' },
        { id: 'attr10', descricao: 'Deu testemunho na célula' },
        { id: 'attr11', descricao: 'Foi batizado nas águas' },
        { id: 'attr12', descricao: 'Foi batizado no Espírito Santo e ora em línguas' },
        { id: 'attr13', descricao: 'Está matriculado no CTL' },
        { id: 'attr14', descricao: 'É fiel nos dízimos e ofertas' },
        { id: 'attr15', descricao: 'Tem compromisso de ganhar a família pra Jesus' },
        { id: 'attr16', descricao: 'Freqüenta fielmente o TADEL' },
        { id: 'attr17', descricao: 'Já tem MDA-3' },
        { id: 'attr18', descricao: 'Participou ativamente de multiplicação de célula' },
        { id: 'attr19', descricao: 'Passou pelo preparo prático da célula' },
        { id: 'attr20', descricao: 'É padrão dos fiéis' },
        { id: 'attr21', descricao: 'Tem aprovação do pastor para ser líder de célula' },
        { id: 'attr22', descricao: 'Completou o CTL' }
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
        $scope.selection = $dao.cloneObject(item);
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
        if (!record.membroId) {
            return;
        }
        if (record.id) {
            $scope.trilhos.update(record);
        } else {
            var results = $scope.trilhos.filter({ membroId: record.membroId }),
                alertPopup;
            
            if (results.length > 0) {
                alertPopup = $ionicPopup.alert({
                    title: 'Atenção',
                    template: 'Este membro já está no trilho',
                    okType: 'button-energized'
                });

                alertPopup.then();
                
                return;                
            }
            
            $scope.trilhos.insert(record);
        }
        
        $scope.trilhos.post(function() {
            $scope.form.closeModal();
        });
    }
});