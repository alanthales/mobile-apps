angular.module('budget.pagamentos', [])
.controller('PagtosCtrl', function($scope, $rootScope, $ionicPopup, daoFactory, utils) {
    $scope.datepickerObject = {
        titleLabel: 'Selecione um vencimento',  //Optional
        todayLabel: 'Hoje',  //Optional
        closeLabel: 'Sair',  //Optional
        setLabel: 'OK',  //Optional
        setButtonType : 'button-positive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-outline',  //Optional
        weekDaysList: ["D", "S", "T", "Q", "Q", "S", "S"], //Optional
        monthList: $rootScope.listaMes, //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        from: new Date(1100, 0, 1), //Optional
        callback: function (val) {  //Mandatory
            if (val) {
                $scope.selection.vencimento = val;
            }
        },
        dateFormat: 'dd/MM/yyyy', //Optional
        closeOnSelect: false //Optional
    };
    
    $scope.selection = { };
    
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.pagamentos = daoFactory.getPagamentos();
    
    utils.initModal('./app/views/pagamentos/cadastro.html', $scope);
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.newItem = function() {
        var hoje = new Date();
        $scope.selection = {
            vencimento: hoje,
            marcadores: [],
            usuario: $rootScope.user.id
        };
        $scope.datepickerObject.inputDate = hoje;
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        var item = $scope.selection;
        $scope.selection = OjsUtils.cloneObject($scope.menu.selectedItem);
        $scope.datepickerObject.inputDate = item.vencimento;
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okType: 'button-calm',
                okText: 'Sim',
                cancelText: 'Não',
                template: 'Deseja realmente excluir este pagamento?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.pagamentos.delete($scope.menu.selectedItem);
                $scope.pagamentos.post();
            }
        });
    }

    $scope.saveItem = function(item) {
        if (!$scope.formbase.$valid) {
            return;
        }
        
        item.marcadores.sort();
        
        $scope.pagamentos.save(item);
        $scope.pagamentos.post();
        $scope.modal.hide();
    }
    
    $scope.addMark = function(marcador) {
        var marcadores = $scope.selection.marcadores,
            index = marcadores.indexOf(marcador.id);
        if (index >= 0) {
            marcadores.splice(index, 1);
        } else {
            marcadores.push(marcador.id);
        }
    }
});