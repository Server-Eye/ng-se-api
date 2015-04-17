"use strict";

angular.module('se').controller('SocketExampleController', ['$scope', 'seaSocket', function($scope, seaSocket) {
    seaSocket.connect();
}]);
