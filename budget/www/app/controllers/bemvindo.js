angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $ionicPopup, daoFactory) {
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
            return;
        }
        
        function error(err) {
            console.log( JSON.stringify(err) );
            $ionicPopup.alert({
                title: 'Erro!',
                okType: 'button-calm',
                template: 'Desculpe-nos, mas ocorreu algo inesperado'
            }).then();
        };
        
        sync.getItem('usuarios', user.id, function(item) {
            if (item && item.senha && item.senha !== user.senha) {
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
        
        registerUser($rootScope.user, function() {
            $rootScope.user.registrado = true;
            window.localStorage.setItem('usuario', JSON.stringify( $rootScope.user ));
            $state.go('app.dashboard');
        });
    }
});