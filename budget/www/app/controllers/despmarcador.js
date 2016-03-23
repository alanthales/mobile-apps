angular.module('budget.despmarc', [])
.controller('DespMarcadorCtrl', function($scope, $stateParams, daoFactory) {
//    var limit = 25;
//    
//    $scope.limitData = limit;
    
    daoFactory.getMarcadores(function(results) {
        var index = results.indexOfKey('id', parseInt($stateParams.marcadorId));
        $scope.marcador = results[index].descricao;
    });
    
    daoFactory.getDespesas(function(results) {
        $scope.despesas = results
            .query({ marcadores: { $contain: $stateParams.marcadorId } })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'dia'])
            .orderBy({ ano: 'desc', mes: 'desc', dia: 'asc' });
    });
    
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