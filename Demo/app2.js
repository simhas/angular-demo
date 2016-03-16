// JavaScript source code
angular.module('DemoApp', ['ui.router', 'ngMaterial'])
    .controller('AppCtrl', function($http, $scope) {
        var url = "http://alpha-flyplasser.azurewebsites.net/api/values?";

        var req = {
            method: 'GET',
            url: url + 'from=OSL&direction=d&start=2016-03-15T18:00&end=2016-03-15T18:59&language=no',
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
    });
