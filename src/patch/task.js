(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchTask', ['SeaRequest', 'seaPatchHelperMicroService',
        function (SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('tasks/{taskId}'));
            var requestList = new SeaRequest(seaPatchHelper.getUrl('tasks/list'));

            function list(containerIds) {
                return requestList.post({
                    containerIds: containerIds,
                });
            }

            function destroy(taskId) {
                return request.del({
                    taskId: taskId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            return {
                list: function (containerIds) {
                    return list(containerIds);
                },
                destroy: function (taskId) {
                    return destroy(taskId);
                },
                /**
                 * create smart updates task
                 * @param {Object} params
                 * @config {Array<String>} containerIds
                 * @config {Array<String>} trigger
                 * @config {<String>} action shutdown or restart
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update smart updates task
                 * @param {Object} params
                 * @config {String} taskId
                 * @config {Array<String>} [trigger]
                 * @config {String} [name]
                 * @config {String} [description]
                 * @config {<String>} [action] shutdown or restart
                 */
                update: function (params) {
                    return update(params);
                },
            };
        }]);
})();