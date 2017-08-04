angular.module('budget.despesas', [])
.controller('DespesasCtrl', function(marcadores, despesas, $scope, $rootScope, $ionicModal, $ionicPopup, utils) {
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
//        modalHeaderColor: 'bar-calm', //Optional
//        modalFooterColor: 'bar-calm', //Optional
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
	
	$scope.marcadores = marcadores;
	$scope.despesas   = despesas;
	
	utils.initModal('./app/views/despesas/cadastro.html', $scope);

	$scope.closeForm = function() {
		$scope.modal.hide();
	}

	$scope.newItem = function() {
		var hoje = new Date();
		$scope.selection = {
			dia: hoje.getDate(),
			mes: hoje.getMonth(),
			ano: hoje.getFullYear(),
			marcadores: [],
			usuario: $rootScope.user.id
		};
		$scope.parcelas = { valor: 1, habilitado: true };
		$scope.datepickerObject.inputDate = hoje;
		$scope.modal.show();
	}
	
	$scope.editItem = function() {
		var item = $scope.selection;
		$scope.selection = OjsUtils.cloneObject($scope.menu.selectedItem);
		$scope.parcelas = { valor: 1, habilitado: false };
		$scope.datepickerObject.inputDate = new Date(item.ano, item.mes, item.dia);
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
				template: 'Deseja realmente excluir esta despesa?'
			});
		
		confirmPopup.then(function(res) {
			if (res) {
				$scope.despesas
					.delete($scope.menu.selectedItem)
					.post().then();
			}
		});
	}

	var insertParcelas = function(item, parcelas) {
		var data = new Date(item.ano, item.mes, item.dia),
			valor = Number(item.valor / parcelas).toFixed(2),
			i = 1, soma = 0;
		
		for (; i <= parcelas; i++) {
			var toSave = angular.copy(item);

			toSave.ano = data.getFullYear();
			toSave.mes = data.getMonth();
			toSave.dia = data.getDate();
			toSave.valor = valor;
			
			if (i === parcelas) {
				toSave.valor = item.valor - soma;
			}
			
			$scope.despesas.insert(toSave);
			
			data.setMonth(data.getMonth() + 1);
			soma += valor;
		}
	};
	
	$scope.saveItem = function(item) {
		if (!$scope.formbase.$valid) {
			return;
		}
		
		item.marcadores.sort();
		
		if ($scope.parcelas.valor > 1) {
			insertParcelas(item, $scope.parcelas.valor);
		} else {
			$scope.despesas.save(item);
		}
		
		$scope.despesas.post().then();
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