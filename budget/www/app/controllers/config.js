angular.module('budget.config', [])
.controller('ConfigCtrl', function($scope, $rootScope, $ionicPopup) {
    $scope.usuario = HashMap.cloneObject($rootScope.user);
    
    $scope.isDirty = function(form) {
        return !form.$dirty;
    }
    
    $scope.cancel = function() {
        $scope.usuario = HashMap.cloneObject($rootScope.user);
    }

    $scope.submit = function(form) {
        var form = $scope.config.form;
        
        if (!form.$valid) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Verifique os campos em vermelho'
            }).then();
            return;
        }
        
        $rootScope.user = HashMap.cloneObject($scope.usuario);
        window.localStorage.setItem('usuario', JSON.stringify($rootScope.user));
        
        document.forms[form.$name].submit();
    }
    
    $scope.addUser = function() {
//        var prompt = $ionicPopup.
    }
});