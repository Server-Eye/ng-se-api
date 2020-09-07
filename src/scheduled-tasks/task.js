(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksTask', ['SeaRequest', 'seaScheduledTasksHelper',
        function (SeaRequest, seaScheduledTasksHelper) {
            var request = new SeaRequest(seaScheduledTasksHelper.getUrl('/'));
            var requestTask = new SeaRequest(seaScheduledTasksHelper.getUrl('/{taskId}'));

            function get(taskId) {
                return requestTask.get({
                    taskId: taskId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestTask.put(params);
            }

            function destroy(taskId) {
                return requestTask.del({
                    taskId: taskId,
                });
            }

            return {
                get: function (taskId) {
                    return get(taskId);
                },
                /**
                 * create task
                 * @param {Object} params
                 * @config {String} containerId
                 * @config {String} customerId
                 * @config {String} name
                 * @config {Array<String>} triggers
                 * @config {String} [description]
                 * @config {String} [powerShellRepositoryId]
                 * @config {String} [powerShellRepositoryScriptId]
                 * @config {String} [scriptData]
                 * @config {String} [arguments]
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update task
                 * @param {Object} params
                 * @config {String} taskId
                 * @config {String} name
                 * @config {Array<String>} triggers
                 * @config {String} [description]
                 * @config {String} [powerShellRepositoryId]
                 * @config {String} [powerShellRepositoryScriptId]
                 * @config {String} [scriptData]
                 * @config {String} [arguments]
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (taskId) {
                    return destroy(taskId);
                },
            };
        }]);
})();