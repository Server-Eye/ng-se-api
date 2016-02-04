(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchScan', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/scan/{action}');
        
            function format(container) {
                if(!container.JobList) {
                    return container;
                }
                
                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime'].forEach(function (key) {
                        if(job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]).then(function (scan) {
                    return scan[0];
                });
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function create(params) {
                var query = helper.getContainerIds(params.containerIds);
                query.Cron = params.cron;
                
                return request.post(query).then(helper.idListResult);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * create scan job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                }
            };
    }]);
})();