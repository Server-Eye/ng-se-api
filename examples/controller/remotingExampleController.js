"use strict";

angular.module('se').controller('RemotingExampleController', ['$scope', 'seaConfig', 'seaRemoting', function($scope, seaConfig, seaRemoting) {
    seaRemoting.get('4028e08a2e0ed329012e4ca526f705b1', 'df6d8263-1d44-45f2-9255-c1892cdb2a96').then(function (system) {
        console.log('remote system', system);
    });
}]);
