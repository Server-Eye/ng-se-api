"use strict";

angular.module('se').controller('UserExampleController', ['$scope', 'sesUser', function($scope, sesUser) {
    sesUser.search({query: 'kim'}).then(function(result) {
        console.log('user search', result);
    });
}]);
