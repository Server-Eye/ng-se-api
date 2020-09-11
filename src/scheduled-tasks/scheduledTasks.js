(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasks', ['SeaRequest', 'seaScheduledTasksHelper', 'seaScheduledTasksTask',
        function (SeaRequest, seaScheduledTasksHelper, seaScheduledTasksTask) {
            var customerRequest =  new SeaRequest(seaScheduledTasksHelper.getUrl('task/customer/{customerId}'));
            var containerRequest = new SeaRequest(seaScheduledTasksHelper.getUrl('task/container/{containerId}'));

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