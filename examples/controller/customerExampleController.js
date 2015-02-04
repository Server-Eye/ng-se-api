"use strict";

angular.module('se').controller('CustomerExampleController', ['$scope', 'seaCustomer', function($scope, seaCustomer) {
    seaCustomer.get('ceaec5d31c65e0ea011c65fbd23a0101').then(function(result) {
        console.log('customer', result);
    });
}]);
