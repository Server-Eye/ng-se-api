

"use strict";

angular.module('se').controller('CustomerExampleController', ['$scope', 'sesCustomer', function($scope, sesCustomer) {
    sesCustomer.get('ceaec5d31c65e0ea011c65fbd23a0101').then(function(result) {
        console.log('customer', result);
    });
}]);
