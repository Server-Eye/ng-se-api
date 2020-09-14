(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksUtil', ['seaScheduledTasksHelper', 'SeaRequest',
        function (seaScheduledTasksHelper, SeaRequest) {
            var requestTaskScript = new SeaRequest(seaScheduledTasksHelper.getUrl('task/{taskId}/script'));

            function getScriptByTaskId(taskId) {
                return requestTaskScript.get({
                    taskId: taskId,
                });
            }

            return {
                getScriptByTaskId: function (taskId) {
                    return getScriptByTaskId(taskId);
                },
            };
        }]);
})();