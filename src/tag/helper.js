(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaTagHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'tag', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();