// JavaScript source code
angular.module('DemoApp', ['ui.router', 'ngMaterial'])
    .config([
        '$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            delete $httpProvider.defaults.headers.common["Origin"];

        }
    ])
      .config(function($mdThemingProvider) {
          // Configure a dark theme with primary foreground yellow
          $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('red')
            .dark();
      })
    .config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('myState', {
                    url: '/my',
                    controller: 'MyStateController',
                    template:
                        '<div layout="column" ng-cloak class="md-inline-form">'+
							'<md-content layout-gt-sm="row" layout-padding md-theme="docs-dark" search-bar callback="search">'+
							'</md-content>'+
						'</div>'+
						'<md-content layout="row" layout-padding layout-wrap layout-fill style="padding-bottom: 32px;" ng-cloak>'+
							'<md-whiteframe ng-repeat="flight in data.Flights" class="md-whiteframe-1dp" flex-sm="100" flex-gt-sm="50" flex-gt-md="25" layout-align="center center">' +
								'<span>' +
									'<h1>{{flight.FromAirportName}} - {{flight.ToAirportName}}</h1>' +
									'<p>{{flight.ScheduleTimeDay}} - {{flight.ScheduleTimeDate}} - {{flight.ScheduleTimeTime}}</p>' +
									'<p>{{flight.AirlineName}}</p>' +
									'<p ng-if="!flight.ScheduleChanged">On time</p>' +
									'<pre ng-if="flight.ScheduleChanged">{{flight | json}}</pre>' +
                            	'</span>' +
                            '</md-whiteframe>' +
                      	'</md-content>'
                });

        }
    ])
    .controller('AppCtrl', function () {
    })
    .controller('MyStateController', function ($http, $scope) {

        $scope.search = function(model) {

            var url = "http://alpha-flyplasser.azurewebsites.net/api/values?";

            var req = {
                method: 'GET',
                url: url + 'from='+model.from+'?direction=d&start=2016-02-01T17:00&end=2016-02-01T17:59&language=no',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            }

            $http(req)
                .then(function(data) {
                        $scope.data = data.data;
                    },
                    function(error) {
                        $scope.data = error;
                    }
                );
        }
    })
    
