// JavaScript source code
angular.module('DemoApp', ['ui.router', 'ngMaterial'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('red')
          .dark();
    })
    .controller('AppCtrl', function ($http, $scope) {
        var url = "http://alpha-flyplasser.azurewebsites.net/api/values?";
        var req = {
            method: 'GET',
            url: url + 'from=OSL?direction=d&start=2016-02-11T17:00&end=2016-02-11T17:59&language=no',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        }
        $http(req).then(function(data) {
                $scope.data = data.data;
            },
            function(error) {
                $scope.data = error;
            }
        );

        $scope.calculateMin = function(flight) {
            var scheduled = new Date(flight.Flight.ScheduleTime);
            var actuaal = new Date(flight.Flight.StatusTime);
            var diff = Math.abs(scheduled - actuaal) / 36e5; //(60 * 60 * 1000)//

            return diff;
        }
});
