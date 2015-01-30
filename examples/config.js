"use strict";

angular.module('se').config(['sesApiConfigProvider', function(sesApiConfigProvider) {
    sesApiConfigProvider.setApiKey('YOUR-SERVER-EYE-API-KEY');
}]);
