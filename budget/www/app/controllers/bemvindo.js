angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicLoading, daoFactory) {
    $scope.actualSlide = 0;
    
    $scope.disableSlide = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }
    
    $scope.slideTo = function(index) {
        $ionicSlideBoxDelegate.slide(index);
    }
    
    var registerUser = function(user, callback) {
        var sync = daoFactory.getDB().getSyncronizer(),
            cb = callback;
        
        if (!sync) {
            $ionicLoading.hide();
            return;
        }
        
        function error(err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Erro!',
                okType: 'button-calm',
                template: 'Desculpe-nos, mas ocorreu algo inesperado'
            }).then();
        };
        
        sync.getItem('usuarios', user.id, function(item) {
            if (item && item.senha && item.senha !== user.senha) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Atenção!',
                    okType: 'button-calm',
                    template: 'Já existe um usuário com este e-mail. Caso você já fez este cadastro utilize a mesma senha'
                }).then();
                return;
            }
            sync.putItem('usuarios', user, cb, error);
        }, error);
    }
    
    $scope.validate = function(form) {
        if (!$rootScope.hasConnection) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Você deve estar conectado para cadastrar'
            }).then();
            return;
        }
        
        if (!form.$valid) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Verifique os campos em vermelho'
            }).then();
            return;
        };
        
        $ionicLoading.show({
            template: 'Aguarde...'
        });
        
        registerUser($rootScope.user, function() {
            $rootScope.user.registrado = true;
            window.localStorage.setItem('usuario', JSON.stringify( $rootScope.user ));
            $rootScope.syncData();
            $ionicLoading.hide();
            $state.go('app.dashboard');
     });
    }
});