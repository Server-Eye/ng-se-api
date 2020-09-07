(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasks', ['SeaRequest', 'seaScheduledTasksHelper', 'seaScheduledTasksTask',
        function (SeaRequest, seaScheduledTasksHelper, seaScheduledTasksTask) {
            var customerRequest =  new SeaRequest(seaPowerShellHelper.getUrl('customer/{customerId}"'));
            var containerRequest = new SeaRequest(seaPowerShellHelper.getUrl('container/{containerId}"'));

            function getByContainerId(containerId) {
                return containerRequest.get({
                    containerId: containerId,
                });
            }
            
            function getByCustomerId(customerId) {
                return customerRequest.get({
                    customerId: customerId,
                });
            }

            return {
                customer: {
                    list: function (customerId) {
                        return getByCustomerId(customerId);
                    },
                },
                container: {
                    list: function (containerId) {
                        return getByContainerId(containerId)
                    },
                },
                task: seaScheduledTasksTask,
            };
        }]);
})();