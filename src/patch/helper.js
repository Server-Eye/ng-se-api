(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return ['http://localhost:3001', path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();