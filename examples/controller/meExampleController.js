"use strict";

angular.module('se').controller('MeExampleController', ['$scope', 'sesMe', function($scope, sesMe) {
    sesMe.me().then(function(result) {
        console.log('me', result);
    });
}]);
