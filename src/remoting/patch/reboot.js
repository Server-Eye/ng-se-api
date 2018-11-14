(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchReboot', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/reboot'));

            function create(params) {
                var customerId = params.customerId,
                    userId = params.userId,
                    containerId = params.containerId,
                    cron = params.cron,
                    action = params.action;

                var reqParams = {
                    Cron: cron,
                    Action: action,
                    UserId: userId
                };

                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));

                return request.post(reqParams).then(helper.idListResult);
            }

            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);

                return request.del(query).then(helper.idListResult);
            }

            return {
                /**
                 * create reboot job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerId]
                 * @config {String} [action]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (customerId, jobId) {
                    return destroy(customerId, jobId);
                }
            };
    }]);
})();