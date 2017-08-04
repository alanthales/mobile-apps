angular.module('budget.despmarc', [])
.controller('DespMarcadorCtrl', function($scope, $stateParams, marcadores, despesas) {
//    var limit = 25;
//    
//    $scope.limitData = limit;
    
    $scope.marcador = marcadores.get(parseInt($stateParams.marcadorId)).descricao;
    
    $scope.despesas = despesas
        .filter({ marcadores: { $contain: $stateParams.marcadorId } })
        .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'dia'])
        .orderBy({ ano: 'desc', mes: 'desc', dia: 'asc' });
    
//    $scope.loadMore = function() {
//        $scope.limitData += limit;
//        $scope.$broadcast('scroll.infiniteScrollComplete');
//    };
    
    $scope.getDate = function(item) {
        return new Date(item.ano, item.mes, item.dia);
    }
    
//    $scope.getTotal = function(ano, mes) {
//        return $scope.despesas.query({ ano: ano, mes: mes }).compute({ $sum: 'valor' }).valor;
//    }
});