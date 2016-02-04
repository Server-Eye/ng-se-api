(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchHistory', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/history/{action}');
        
            function format(container) {
                if(!container.JobList) {
                    return container;
                }
                
                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if(job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });
                
                return container;
            }
                
            function get(customerId, cId, paging) {
                return list(customerId, [cId], paging).then(function (history) {
                    return (history[0] || {}).JobList;
                });
            }

            function list(customerId, containerIds, paging) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                if(paging) {
                    query.Index = paging.index;
                    query.Count = paging.count;
                }
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId, paging) {
                    return get(customerId, cId, paging);
                },

                list: function (customerId, containerIds, paging) {
                    return list(customerId, containerIds, paging);
                }
            };
    }]);
})();