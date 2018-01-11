(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchHistory', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
        function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/history/{action}'));

            function format(container) {
                if (!container.JobList) {
                    return container;
                }

                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function get(customerId, cId, params) {
                return list(customerId, [cId], params).then(function (history) {
                    return (history[0] || {}).JobList;
                });
            }

            function list(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.index != null) {
                    query.Index = params.index;
                }

                if (params.count != null) {
                    query.Count = params.count;
                }

                if (params.from != null) {
                    query.From = params.from;
                }

                if (params.states != null) {
                    query.States = params.states;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId, params) {
                    return get(customerId, cId, params);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
                }
            };
        }]);
})();