"use strict";

angular.module('se').controller('UserExampleController', ['$scope', 'seaUser', function($scope, seaUser) {
    seaUser.search({query: 'kim'}).then(function(result) {
        console.log('user search', result);
    });
}]);
