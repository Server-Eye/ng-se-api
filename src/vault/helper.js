(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();