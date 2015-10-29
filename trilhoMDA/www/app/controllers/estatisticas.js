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
            membros = {}, //osmais = [], osmenos = [],
            ofertas = 0, visitantes = 0,
            j, obj;
        
//        for (j in $scope.celula.membros) {
//            membros[j] = 0;
//        }
        
        for (; i < l; i++) {
            ofertas += results[i].oferta;
            visitantes += results[i].visitantes.length;
            
            for (j = 0; j < results[i].membros.length; j++) {
                obj = results[i].membros[j];
                if (obj.presente) {
                    membros[obj.id] = membros[obj.id] ? membros[obj.id]+1 : 1;
                } else {
                    membros[obj.id] = membros[obj.id] ? membros[obj.id]-1 : -1;
                }
            }
        }
        
        console.log(ofertas, visitantes);
        
        $scope.estat.ofertas = ofertas / l;
        $scope.estat.visitantes = visitantes / l;
        
        for (j in membros) {
            if (membros[j] > 0) {
                $scope.estat.osmais.push(j);
            }
            if (membros[j] < 0) {
                $scope.estat.osmenos.push(j);
            }
        }
        
        $scope.estat.osmais.sort(function(a, b){return b-a});
        if ($scope.estat.osmais.length > 3) {
            $scope.estat.osmais.slice(2);
        }
        
        $scope.estat.osmenos.sort(function(a, b){return b-a});
        if ($scope.estat.osmenos.length > 3) {
            $scope.estat.osmenos.slice(2);
        }
        
        console.log($scope.estat.osmais);
        console.log($scope.estat.osmenos);
    });
});
