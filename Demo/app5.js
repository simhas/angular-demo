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
                .state('frontpage', {
                    url: '/',
                    template: ''
                })
                .state('terms', {
                    url: '/terms',
                    template: '<p>Here are some terms <a ui-sref="frontpage">Close</a> </p>'
                })
                .state('flight', {
                    url: '/flight?flightId',
                    template: '<p>{{flightId}}</p>',
                    controller: function ($scope, $stateParams) {
                        $scope.flightId = $stateParams.flightId;
                    }
                });

        }
    ])
    .controller('AppCtrl', function ($http, $scope, $filter) {

        $scope.model = {};
        $scope.model.from = 'OSL';
        $scope.model.date = new Date();
        $scope.model.time = 11;

        $scope.model.direction = 'd';
        $scope.directions = [
                    { value: 'd', abbrev: "Depature" },
                    { value: 'a', abbrev: "Arrival" },
        ];

        $scope.dosearch = search;
        search();

        function search() {
            var date = $filter('date')($scope.model.date, "yyyy-MM-dd");
            var time = $scope.model.time;
            if (time < 10) {
                time = "0" + time;
            }

            var url = "http://alpha-flyplasser.azurewebsites.net/api/values?";
            var req = {
                method: 'GET',
                url: url + 'from=' + $scope.model.from + '&direction=' + $scope.model.direction + '&start=' +
                    date + 'T' +
                    time + ':00&end=' +
                    date + 'T' +
                    time + ':59&language=no',
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
.directive('flightInfo', function () {
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
})
.directive('searchBar', function() {
    return {
        scope: {
            callback: "&",
            model: "=",
        },
        controller: function ($scope) {
            $scope.callback = $scope.callback();
            $scope.dosearch = function () {
                $scope.callback($scope.model);
            }
            $scope.directions = [
                    { value: 'd', abbrev: "Depature" },
                    { value: 'a', abbrev: "Arrival" },
            ];
        },
        template: '<div layout="column" ng-cloak class="md-inline-form">'+
            '<md-content layout-gt-sm="row" layout-padding md-theme="docs-dark">'+
               '<md-input-container>'+
                    '<label>From</label>'+
                    '<input ng-model="model.from" />'+
                '</md-input-container>'+

                '<md-input-container class="md-block">'+
                    '<label>Direction</label>'+
                    '<md-select ng-model="model.direction">'+
                        '<md-option ng-repeat="direction in directions" value="{{direction.value}}">'+
                        '{{direction.abbrev}}'+
                        '</md-option>'+
                    '</md-select>'+
                '</md-input-container>' +
    
                '<md-datepicker ng-model="model.date" md-placeholder="Enter date">'+
                '</md-datepicker>'+
                
                '<md-slider style="width: 50px;" flex min="6" max="18" ng-model="model.time" aria-label="time">'+
                '</md-slider>'+

                '<md-input-container>' +
                    '<label style="color: white">{{model.time}}:00</label>'+
                '</md-input-container>'+
                

                '<md-input-container>'+
                    '<md-button class="md-raised md-primary" ng-click="dosearch()">Search</md-button>'+
                '</md-input-container>'+
            '</md-content>'+
        '</div>'
    };
});

