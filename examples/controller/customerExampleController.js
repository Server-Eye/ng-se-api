"use strict";

angular.module('se').controller('CustomerExampleController', ['$scope', 'seaCustomer', function ($scope, seaCustomer) {
    seaCustomer.get('ceaec5d31c65e0ea011c65fbd23a0101').then(function (result) {
        console.log('customer', result);
    });

    seaCustomer.location.update({
        cId: 'ceaec5d31c65e0ea011c65fbd23a0101',
        geo: {
            address: {
                city: "Eppelborn",
                country: "Deutschland",
                road: "Kossmannstrasse",
                house_number: 7
            }
        }
    }).then(function (result) {
        console.log('customer.location.update', result);
    });

    seaCustomer.location.get('ceaec5d31c65e0ea011c65fbd23a0101').then(function (result) {
        console.log('customer.location.get', result);
    })
}]);
