(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getVaultUrl(), seaConfig.getVaultApiVersion(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();