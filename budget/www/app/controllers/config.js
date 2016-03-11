angular.module('budget.config', [])
.controller('ConfigCtrl', function($scope, $rootScope, $ionicPopup, utils) {
    $scope.usuario = HashMap.cloneObject($rootScope.user);
    
    $scope.isDirty = function(form) {
        return form.$dirty;
    }
    
    $scope.cancel = function() {
        $scope.config.form.$setPristine();
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
        utils.lStorage.setItem('usuario', $rootScope.user);
        
        document.forms[form.$name].submit();
    }
    
    $scope.addUser = function() {
        $scope.newUser = {};
        
        var prompt = $ionicPopup.show({
            template:
                [
                    '<label class="item item-input">',
                    '  <input type="text" placeholder="Nome do dependente" ng-model="newUser.nome">',
                    '</label>',
                    '<label class="item item-input">',
                    '  <input type="email" placeholder="E-mail do dependente" ng-model="newUser.email">',
                    '</label>',
                    '<label class="item item-input">',
                    '  <input type="password" placeholder="Senha para logar" ng-model="newUser.senha">',
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
                        if (!$scope.newUser.email || !$scope.newUser.senha) {
                            e.preventDefault();
                        } else {
                            return true;
                        }
                    }
                }
            ]
        });
        
        prompt.then(function(res) {
            if (res) {
                $scope.usuario.grupo.push($scope.newUser);
            }
        });
    }
});