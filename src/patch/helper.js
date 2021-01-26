(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getPmUrl(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelperMicroService', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'smart-updates', path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();