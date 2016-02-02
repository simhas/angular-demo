// JavaScript source code
angular.module('DemoApp', ['ui.router', 'ngMaterial'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('red')
          .dark();
    })
    .config([
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('terms', {
                    url: '/terms',
                    template: '<p>Here are some terms</p>'
                });

        }
    ])
    .controller('AppCtrl', function ($http, $scope) {

        $scope.model = {};
        $scope.model.from = 'OSL';

        $scope.model.direction = 'd';
        $scope.directions = [
                    { value: 'd', abbrev: "Depature" },
                    { value: 'a', abbrev: "Arrival" },
        ];

        $scope.dosearch = search;
        search();

        function search() {
            var url = "http://alpha-flyplasser.azurewebsites.net/api/values?";
            var req = {
                method: 'GET',
                url: url + 'from='+ $scope.model.from +'?direction=d&start=2016-02-02T17:00&end=2016-02-02T17:59&language=no',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            }
            $http(req).then(function (data) {
                $scope.data = data.data;
            },
                function (error) {
                    $scope.data = error;
                }
            );
        }

        

        $scope.calculateMin = function (flight) {
            var scheduled = new Date(flight.Flight.ScheduleTime);
            var actuaal = new Date(flight.Flight.StatusTime);
            var diff = Math.abs(scheduled - actuaal) / 36e5; //(60 * 60 * 1000)//

            return diff;
        }
    })
.directive('flightInfo', function() {
    return {
        scope: {
            flight: "="
        },
        controller: function ($scope) {
            $scope.scheduleTime = $scope.flight.ScheduleTime;
            $scope.airlineName = $scope.flight.AirlineName;
        },
        template: "{{scheduleTime | date: 'shortTime'}} - {{airlineName}}"
    };
});

