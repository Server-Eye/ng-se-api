"use strict";

angular.module('se').controller('SocketExampleController', ['$scope', 'seaConfig', 'seaSocket', function($scope, seaConfig, seaSocket) {
    if(seaConfig.getApiKey()) {
        seaSocket.connect({ apiKey: seaConfig.getApiKey() }, []);
    } else {
        seaSocket.connect();
    }
}]);
