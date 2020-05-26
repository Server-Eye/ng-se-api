(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'powershell', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();