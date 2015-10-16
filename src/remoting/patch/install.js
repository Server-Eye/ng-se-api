(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchInstall', ['$http', 'SeaRequest', 'seaRemotingPatchHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/install/{action}');
        
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
                return list(customerId, [cId]).then(function (install) {
                    return install[0];
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
                var customerId = params.customerId,
                    containerId = params.containerId,
                    categories = params.categories,
                    software = params.softwareId,
                    cron = params.cron;
                                
                var reqParams = {
                    Cron: cron
                };
                
                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));
                
                if(categories) {
                    reqParams.CategoryList = categories;
                }
                if(software) {
                    reqParams = angular.extend(reqParams, helper.getSoftwareIds(software));
                }
                                
                return request.post(reqParams).then(help.idListResult);
            }
        
            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);
                
                return request.del(query).then(helper.idListResult);
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
                 * @config {String|Array} [containerId]
                 * @config {String|Array} [softwareId]
                 * @config {Array} [categories]
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