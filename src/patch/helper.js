(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getPatchUrl(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();