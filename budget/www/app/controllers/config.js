angular.module('budget.config', [])
.controller('ConfigCtrl', function($scope, $rootScope, $ionicPopup, utils, SyncSDB) {
    $scope.usuario = ArrayMap.cloneObject($rootScope.user);
    
    $scope.cancel = function() {
        $scope.config.form.$setPristine();
        $scope.usuario = ArrayMap.cloneObject($rootScope.user);
    }

    function error(err) {
        $ionicPopup.alert({
            title: 'Atenção!',
            okType: 'button-calm',
            template: 'Desculpe-nos, mas ocorreu algo inesperado'
        }).then();
    }
    
    $scope.submit = function() {
        var form = $scope.config.form,
            total = $scope.user.grupo.length;
        
        if (!form.$valid) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Verifique os campos em branco/vermelho'
            }).then();
            return;
        }

        if (form.novaSenha.$viewValue !== $rootScope.user.senha && form.senha.$viewValue !== $rootScope.user.senha) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'A senha atual está incorreta'
            }).then();
            return;
        }
        
        delete $scope.usuario.senhaAtual;
        $rootScope.user = ArrayMap.cloneObject($scope.usuario);
        utils.lStorage.setItem('usuario', $rootScope.user);
        document.forms[form.$name].submit();
    }
    
    $scope.addUser = function() {
        if (!utils.hasConnection) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Você deve estar conectado para fazer isso'
            }).then();
            return;
        }
        
        $scope.newUser = { titular: $scope.user.id };
        
        var prompt = $ionicPopup.show({
            template:
                [
                    '<label class="item item-input">',
                    '  <input type="text" placeholder="Nome completo" ng-model="newUser.nome" required minlength="2" maxlength="80">',
                    '</label>',
                    '<label class="item item-input">',
                    '  <input type="text" placeholder="Login" ng-model="newUser.id" required minlength="3" maxlength="20">',
                    '</label>',
                    '<label class="item item-input">',
                    '  <input type="password" placeholder="Senha" ng-model="newUser.senha" required minlength="4" maxlength="30">',
                    '</label>',
                ].join(''),
            title: 'Novo Dependente',
            scope: $scope,
            buttons: [
                { text: 'Cancelar' },
                {
                    text: 'Confirmar',
                    type: 'button-calm',
                    onTap: function(e) {
                        if (!$scope.newUser.id || !$scope.newUser.nome || !$scope.newUser.senha) {
                            e.preventDefault();
                        } else {
                            return true;
                        }
                    }
                }
            ]
        });
        
        function success(user) {
            if (user) {
                $ionicPopup.alert({
                    title: 'Atenção!',
                    okType: 'button-calm',
                    template: 'Já existe um usuário com este login'
                }).then();
                return;
            }
            SyncSDB.putItem('usuarios', $scope.newUser, function() {
                $rootScope.user.grupo.push($scope.newUser);
                utils.lStorage.setItem('usuario', $rootScope.user);
            }, error);
        };
        
        prompt.then(function(res) {
            if (res) {
                SyncSDB.getItem('usuarios', $scope.newUser.id, success, error);
            }
        });
    }
    
    $scope.delUser = function(index) {
        if (!utils.hasConnection) {
            $ionicPopup.alert({
                title: 'Atenção!',
                okType: 'button-calm',
                template: 'Você deve estar conectado para fazer isso'
            }).then();
            return;
        }

        var index = index,
            user = $rootScope.user.grupo[index],
            confirm = $ionicPopup.confirm({
                title: 'Atenção!',
                okType: 'button-calm',
                okText: 'Sim',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este dependente?'
            });
        
        function success() {
            $rootScope.user.grupo.splice(index, 1);
            utils.lStorage.setItem('usuario', $rootScope.user);
        };
        
        confirm.then(function(res) {
            if (res) {
                SyncSDB.deleteAttr('usuarios', user.id, 'titular', success, error);
            }
        });
    }
});