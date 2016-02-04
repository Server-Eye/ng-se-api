(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingAntivirus', [ '$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/virus/1.0/{section}/{action}');
        
            function format(container) {
                if(!container.EventList) {
                    return container;
                }
                
                container.EventList.forEach(function (job) {
                    ['Timestamp'].forEach(function (key) {
                        if(job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });
                
                return container;
            }
                
            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig;
                
                if(!angular.isArray(containerConfig)) {
                    containerConfig = [ containerConfig ];
                }
                
                containerConfig = containerConfig.map(function (c) {
                    return {
                        ContainerId: c.containerId,
                        Token: c.token
                    };
                });
                
                return request.post({
                    section: 'container',
                    ContainerList: containerConfig
                });
            }
        
            function get(customerId, cId, paging) {
                return list(customerId, [cId], paging).then(function (history) {
                    return (history[0] || {}).EventList;
                });
            }

            function list(customerId, containerIds, paging) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'event';
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
                },
                
                /**
                 * activate antivirus on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 */
                activate: function (params) {
                    return activate(params);
                }
            };
    }]);
})();