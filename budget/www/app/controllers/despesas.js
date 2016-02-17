angular.module('budget.despesas', [])
.controller('DespesasCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, daoFactory) {
    $scope.datepickerObject = {
        titleLabel: 'Selecione uma data',  //Optional
        todayLabel: 'Hoje',  //Optional
        closeLabel: 'Fechar',  //Optional
        setLabel: 'OK',  //Optional
        setButtonType : 'button-positive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
//        closeButtonType : 'button-light',  //Optional
//        inputDate: new Date(),  //Optional
//        disabledDates: disabledDates, //Optional
        weekDaysList: ["D", "S", "T", "Q", "Q", "S", "S"], //Optional
        monthList: $rootScope.listaMes, //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        from: new Date(1100, 0, 1), //Optional
        callback: function (val) {  //Mandatory
            if (val) {
                $scope.selection.data = val;
            }
        },
        dateFormat: 'dd/MM/yyyy', //Optional
        closeOnSelect: false //Optional
    };
    
    $scope.selection = { };
    
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.despesas   = daoFactory.getDespesas();
    
    $ionicModal.fromTemplateUrl('./app/views/despesas/cadastro.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.closeForm = function() {
        $scope.modal.hide();
    }

    $scope.newItem = function() {
        $scope.selection = { data: new Date(), marcadores: [] };
        $scope.datepickerObject.inputDate = $scope.selection.data;
        $scope.modal.show();
    }
    
    $scope.editItem = function() {
        $scope.selection = $scope.despesas.cloneObject($scope.menu.selectedItem);
        $scope.datepickerObject.inputDate = new Date($scope.selection.data);
        $scope.modal.show();
        $scope.menu.closeMenu();
    }
    
    $scope.deleteItem = function() {
        $scope.menu.closeMenu();
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okText: 'Sim',
                okType: 'button-positive',
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
});