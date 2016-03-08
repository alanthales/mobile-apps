angular.module('budget.despesas', [])
.controller('DespesasCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, daoFactory) {
    $scope.datepickerObject = {
        titleLabel: 'Selecione uma data',  //Optional
        todayLabel: 'Hoje',  //Optional
        closeLabel: 'Sair',  //Optional
        setLabel: 'OK',  //Optional
        setButtonType : 'button-positive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-outline',  //Optional
//        inputDate: new Date(),  //Optional
//        disabledDates: disabledDates, //Optional
        weekDaysList: ["D", "S", "T", "Q", "Q", "S", "S"], //Optional
        monthList: $rootScope.listaMes, //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-calm', //Optional
        modalFooterColor: 'bar-calm', //Optional
        from: new Date(1100, 0, 1), //Optional
        callback: function (val) {  //Mandatory
            if (val) {
                $scope.selection.dia = val.getDate();
                $scope.selection.mes = val.getMonth();
                $scope.selection.ano = val.getFullYear();
            }
        },
        dateFormat: 'dd/MM/yyyy', //Optional
        closeOnSelect: false //Optional
    };
    
    $scope.selection = { };
    
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.despesas   = daoFactory.getDespesas();
    
    $scope.$on('$ionicView.enter', function() {
        $ionicModal.fromTemplateUrl('./app/views/despesas/cadastro.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });
        
    $scope.$on('$ionicView.leave', function() {
        $scope.modal.remove();
    });
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.newItem = function() {
        var hoje = new Date();
        $scope.selection = {
            dia: hoje.getDate(),
            mes: hoje.getMonth(),
            ano: hoje.getFullYear(),
            marcadores: []
        };
        $scope.datepickerObject.inputDate = hoje;
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        var item = $scope.selection;
        $scope.selection = HashMap.cloneObject($scope.menu.selectedItem);
        $scope.datepickerObject.inputDate = new Date(item.ano, item.mes, item.dia);
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-calm',
                cancelText: 'Não',
                template: 'Deseja realmente excluir esta despesa?'
            });
        
        confirmPopup.then(function(res) {
            if (res) {
                $scope.despesas.delete($scope.menu.selectedItem);
                $scope.despesas.post();
            }
        });
    }

    $scope.saveItem = function(item) {
        item.marcadores.sort();
        $scope.despesas.save(item);
        $scope.despesas.post();
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
    
    $scope.getDate = function(item) {
        return new Date(item.ano, item.mes, item.dia);
    }
});