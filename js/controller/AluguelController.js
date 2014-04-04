/*
 * Estacionamento Controller
 */
 estacionamentoApp.controller('aluguelController', function($scope, IdxDbService) {
 	$scope.list = [];

 	$scope.total = function() {
 		var total = 0;
 		
 		$scope.list.forEach(function(aluguel) {
 			total += aluguel.modelo;
 		});

 		return total;
 	}

 	$scope.init = function() {
 		
 		console.log('INIT');
        $scope.modalForm = $('#modalForm');
        $scope.modalDelete = $('#modalConfimation');

        IdxDbService.init();		
        $('#loading').modal('show');
		console.log("Lendo os veiculos");        
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.list = IdxDbService.getcarros();
                $('#loading').modal('hide');
            });
        }, 2000);
 	};

 	$scope.addAluguel = function() {
 		var aluguel = {};
 		if($scope.key >= 0){
 			//update
 			aluguel = getElementByKey($scope.key);
 			aluguel.key = $scope.key;
 			aluguel.marca = $scope.marca;
 			aluguel.modelo = $scope.modelo;
 			aluguel.placa = $scope.placa;
 			aluguel.horaentrada = $scope.horaentrada;
 			IdxDbService.update(aluguel);

 		}else{
 			//create
 			aluguel.marca = $scope.marca;
 			aluguel.modelo = $scope.modelo;
 			aluguel.placa = $scope.placa;
 			aluguel.horaentrada = $scope.horaentrada;
 			aluguel = IdxDbService.create(aluguel);
 			$scope.list.push(aluguel);
 		}
 		
 		$scope.clearFields();
 		//$scope.modalForm.modal('hide');
 	}

 	$scope.clearFields = function() {
        $scope.marca = $scope.marca = "";
        $scope.modelo = $scope.modelo = "";
        $scope.placa = $scope.placa = "";
        $scope.horaentrada = $scope.horaentrada = "";
    };

     $scope.prepareEditAluguel = function(aluguel) {
 		//var aluguel = $scope.protocols[index];
 		$scope.marca = aluguel.marca;
 		$scope.modelo = aluguel.modelo;
 		$scope.horaentrada = aluguel.horaentrada;
 		$scope.placa = aluguel.placa;
		$scope.key = aluguel.key;
 		//$scope.index = index;
 		//$scope.showModal('edit');
 	};

 	$scope.editAluguel = function(aluguel){
		$scope.key = aluguel.key;
		$scope.marca = aluguel.marca;
		$scope.modelo = aluguel.modelo;
		$scope.placa = aluguel.placa;
		$scope.horaentrada = aluguel.horaentrada;		
	}
	
	$scope.prepareDeleteAluguel = function(index) {
 		$scope.index = index;
 		$scope.modalDelete.modal('show');
 	};
	
 	$scope.deleteAluguel = function(aluguel) {
 		console.log(aluguel);
 		if(aluguel) {
            //var key = $scope.list[$scope.index].key;
            var indexInList = getPositionOfElement(aluguel);
 			IdxDbService.deletealuguel(aluguel.key);
 			$scope.list.splice(indexInList, 1);	
            
			//$scope.list = IdxDbService.getcarros();
 		}
        $scope.index = -1;
 		$scope.modalDelete.modal('hide');
 	};

 	function getPositionOfElement(aluguel){
 		var id = 0;
 		$scope.list.forEach(function(element, index){
 			if(element.key == aluguel.key){
 				id = index;
 			}
 		})
 		return id;
 	}
 	function getElementByKey(key){
 		var aluguel = {};
 		$scope.list.forEach(function(element, index){
 			if(element.key == key){
 				aluguel = element;
 			}
 		})
 		return aluguel;
 	}
	$scope.generateId = function(){
		return Math.floor((Math.random()*1000)+1);
	}
 });