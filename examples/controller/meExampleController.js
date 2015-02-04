"use strict";

angular.module('se').controller('MeExampleController', ['$scope', 'seaMe', function($scope, seaMe) {
    seaMe.me().then(function(result) {
        console.log('me', result);
    });
    
    seaMe.nodes().then(function(result) {
        console.log('me nodes', result);
    });
}]);
