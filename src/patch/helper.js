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