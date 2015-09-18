angular.module('controllers.contato', ['trilhoMDA'])

.controller('ContatoCtrl', function($scope, $ionicBackdrop, $ionicHistory) {
    $scope.dataset = db.getDataSet('contato');
    
    $scope.dataset.open(function() {
        console.log($scope.dataset.data);
    });
    
    $scope.saveContato = function(contato) {
        if (contato.id) {
            $scope.dataset.update(contato);
        } else {
            $scope.dataset.insert(contato);
        }
        $scope.dataset.post(function() {
            $ionicHistory.goBack();
        });
    }
});
