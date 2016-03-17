angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicLoading, SyncSDB, utils) {
    $scope.actualSlide = 0;
    
    $scope.disableSlide = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }
    
    $scope.slideTo = function(index) {
        $ionicSlideBoxDelegate.slide(index);
    }
    
    $scope.info = function() {
        $ionicPopup.alert({
            title: 'Atenção!',
            okType: 'button-calm',
            template: 'Se você já fez o cadastro, informe a mesma senha para recuperar os seus dados'
        }).then();
    }
    
    $scope.validate = function(form) {
        if (!utils.hasConnection) {
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
   
        SyncSDB.registerUser($rootScope.user,
            function(user) {
                if (user && user.senha !== $rootScope.user.senha) {
                    $ionicPopup.alert({
                        title: 'Atenção!',
                        template: 'Já existe um usuário com este login'
                    }).then();
                    return;
                }
            
                $rootScope.user.registrado = true;
                $rootScope.user.grupo = [];

                utils.lStorage.setItem('usuario', $rootScope.user);

                $rootScope.syncData();
                $state.go('app.dashboard');
            },
            function(err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Erro!',
                    template: 'Desculpe-nos, mas ocorreu algo inesperado'
                }).then();
            });
    }
});