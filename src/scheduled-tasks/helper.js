(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'scheduledTasks', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();