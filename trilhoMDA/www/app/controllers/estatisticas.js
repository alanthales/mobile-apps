angular.module('controllers.estatisticas', ['ionic'])

.controller('EstatisticasCtrl', function($scope, $dao) {
    $scope.estat = {
        ofertas: 0.0,
        visitantes: 0.0,
        osmais: [],
        osmenos: []
    };
    
    $dao.getCelulas(function(results) {
        $scope.celula = results[0];
    });
    
    $scope.contatos = $dao.getContatos();
    
    $dao.getChamadas(function(results) {
        if (results.length === 0) {
            return;
        }

        var i = 0, l = results.length,
            membros = new HashMap(), //osmais = [], osmenos = [],
            ofertas = 0, visitantes = 0,
            j, obj, idx;
        
        for (; i < l; i++) {
            ofertas += parseFloat(results[i].oferta);
            visitantes += parseInt(results[i].visitantes.length);
            
            for (j = 0; j < results[i].membros.length; j++) {
                obj = results[i].membros[j];
                
                if (obj.id === $scope.celula.lider || obj.id === $scope.celula.supervisor) {
                    continue;
                }
                
                idx = membros.indexOfKey('id', obj.id);
                
                if (idx === -1) {
                    membros.put({ id: obj.id, peso: (obj.presente ? 1 : -1) });
                } else {
                    membros[idx].peso = obj.presente ? membros[idx].peso +1 : membros[idx].peso -1;
                }
                
//                if (obj.presente) {
//                    membros[obj.id] = membros[obj.id] ? membros[obj.id]+1 : 1;
//                } else {
//                    membros[obj.id] = membros[obj.id] ? membros[obj.id]-1 : -1;
//                }
            }
        }
        
        $scope.estat.ofertas = ofertas / l;
        $scope.estat.visitantes = visitantes / l;
        
        membros.sort(function(a, b){return b.peso - a.peso});
        
        $scope.estat.osmais = membros.filter(function(item) { return item.peso > 0 }).slice(0,3);
        $scope.estat.osmenos = membros.filter(function(item) { return item.peso < 0 }).slice(-3);
        
        $scope.estat.osmenos.sort(function(a,b){return a.peso - b.peso});
    });
});
