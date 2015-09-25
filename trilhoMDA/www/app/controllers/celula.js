angular.module('controllers.celula', ['ionic'])

.controller('CelulaCtrl', function($scope) {
    $scope.celulas = db.createDataSet('celulas');
    
    $scope.celulas.open(function(results) {
        $scope.celula = results[0] || { membros: [] };
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
        $scope.celula.membros.push(membro.id);
        $scope.postCelula();
        $scope.frmMembro.closeModal();
    }
    
    $scope.deleteMembro = function(membro) {
        if (confirm('Deseja realmente excluir este membro?')) {
            $scope.celulas.delete(membro);
            $scope.celulas.post();
        }
    }
    
    $scope.saveCelula = function(celula) {
        $scope.postCelula(celula);
        $scope.frmCelula.closeModal();
    }
});
