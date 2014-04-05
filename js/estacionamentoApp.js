/*
 * AngularJS Module
 */
var estacionamentoApp = angular.module('estacionamentoApp', []);

estacionamentoApp.directive('pieChart', function ($timeout) {
  return {
    restrict: 'Carros',
    scope: {
      marca:    '@marca',
      modelo:    '@modelo',
      horaentrada:   '@horaentrada',
      placa:     '=placa',
      selectFn: '&select'
    },
    link: function($scope, $elm, $attr) {
      
      // Create the placa table and instantiate the chart
      var placa = new google.visualization.placaTable();
      placa.addColumn('string', 'Label');
      placa.addColumn('number', 'Value');
      var chart = new google.visualization.PieChart($elm[0]);

      draw();
      
      // Watches, to refresh the chart when its placa, marca or dimensions change
      $scope.$watch('placa', function() {
        draw();
      }, true); // true is for deep object equality checking
      $scope.$watch('marca', function() {
        draw();
      });
      $scope.$watch('modelo', function() {
        draw();
      });
      $scope.$watch('horaentrada', function() {
        draw();
      });

      function draw() {
        if (!draw.triggered) {
          draw.triggered = true;
          $timeout(function () {
            draw.triggered = false;
            var label, value;
            placa.removeRows(0, placa.getNumberOfRows());
            angular.forEach($scope.placa, function(row) {
              label = row[0];
              value = parseFloat(row[1], 10);
              if (!isNaN(value)) {
                placa.addRow([row[0], value]);
              }
            });
            var options = {'marca': $scope.marca,
                           'modelo': $scope.modelo,
                           'horaentrada': $scope.horaentrada};
            chart.draw(placa, options);
          }, 0, true);
        }
      }
    }
  };
});
