angular.module('controllers.celula', ['ionic'])

.controller('CelulaCtrl', function($scope, $dao, $ionicPopup) {
    $scope.celulas = $dao.getCelulas(function(results) {
        var celula = results[0] || {};
        if (!celula.membros) {
            celula.membros = [];
        }
        $scope.celula = celula;
    });
    
    $scope.contatos = $dao.getContatos();
    
    $scope.dias = [
        { id: 0, nome: 'Domingo' },
        { id: 1, nome: 'Segunda' },
        { id: 2, nome: 'Terça' },
        { id: 3, nome: 'Quarta' },
        { id: 4, nome: 'Quinta' },
        { id: 5, nome: 'Sexta' },
        { id: 6, nome: 'Sábado' }
    ];

    $scope.postCelula = function(record) {
        var celula = record || $scope.celula;
        if (celula.id) {
            $scope.celulas.update(celula);
        } else {
            $scope.celulas.insert(celula);
        }
        $scope.celulas.post();
    }
    
    $scope.addMembro = function(membro) {
        var index = $scope.celula.membros.indexOf(membro.id),
            alertPopup;
        
        if (index !== -1) {
            alertPopup = $ionicPopup.alert({
                title: 'Atenção',
                template: 'Este contato já é membro da célula'
            });
            
            alertPopup.then();
            
            return;
        }
        
        $scope.celula.membros.push(membro.id);
        $scope.postCelula();
        $scope.frmMembro.closeModal();
    }
    
    $scope.deleteMembro = function(membro) {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este membro?'
            }),
            index;
        
        confirmPopup.then(function(res) {
            if (res) {
                index = $scope.celula.membros.indexOf(membro);
                $scope.celula.membros.splice(index, 1);
                $scope.postCelula();
            }
        });
    }
    
    $scope.saveCelula = function(celula) {
        $scope.postCelula(celula);
        $scope.frmCelula.closeModal();
    }
});
