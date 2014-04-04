estacionamentoApp.controller('reportController', function($scope, IdxDbService) {
    $scope.list = [['Task', 'Cars'],
          ['Uno',     11],
          ['Gol',      2],
          ['Palio',  2],
          ['Celta', 2],
          ['Corsa',    7]];
    $scope.pegardados = function(){
        console.log("oi");
        return      
        [ 
          ['Task', 'Cars'],
          ['Uno',     11],
          ['Gol',      2],
          ['Palio',  2],
          ['Celta', 2],
          ['Corsa',    7]
        ]
    };
 });