angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicLoading, daoFactory, utils) {
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
                template: 'Verifique os campos em branco/vermelho'
            }).then();
            return;
        };
        
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner>',
            hideOnStateChange: true
        });
        
        registerUser($rootScope.user, function() {
            var to = {};
            
            $rootScope.user.registrado = true;
            $rootScope.user.grupo = [];
            
            to[$rootScope.user.id] = $rootScope.user.nome;
            utils.sender.email(to, $rootScope.user, 'Bem vindo!', utils.WelcomeMail);
            utils.lStorage.setItem('usuario', $rootScope.user);
                             
            $rootScope.syncData();
            $state.go('app.dashboard');
        });
    }
});