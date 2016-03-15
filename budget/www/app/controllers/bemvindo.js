angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $ionicPopup, $ionicLoading, SyncSDB, utils) {
    $scope.actualSlide = 0;
    
    $scope.disableSlide = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }
    
    $scope.slideTo = function(index) {
        $ionicSlideBoxDelegate.slide(index);
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
            function() {
                $rootScope.user.registrado = true;
                $rootScope.user.grupo = [];

//                to[$rootScope.user.id] = $rootScope.user.nome;
//                utils.sender.email(to, $rootScope.user, 'Bem vindo!', utils.WelcomeMail);
                utils.lStorage.setItem('usuario', $rootScope.user);

                $rootScope.syncData();
                $state.go('app.dashboard');
            },
            function(err) {
                var opts = { okType: 'button-calm' };
            
                if (err.code === 901) {
                    opts.title = 'Atenção!';
                    opts.template = 'Já existe um usuário com este login. Caso você já fez este cadastro utilize a mesma senha';
                } else {
                    opts.title = 'Erro!';
                    opts.template = 'Desculpe-nos, mas ocorreu algo inesperado';
                }
            
                $ionicLoading.hide();
                $ionicPopup.alert(opts).then();
            });
    }
});