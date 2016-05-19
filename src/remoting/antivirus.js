(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingAntivirus', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/virus/1.0/{section}/{action}'));

            function format(container) {
                if (!container.EventList) {
                    return container;
                }

                container.EventList.forEach(function (job) {
                    ['Timestamp'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig;

                if (!angular.isArray(containerConfig)) {
                    containerConfig = [containerConfig];
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

            function get(customerId, cId) {
                return list(customerId, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'container';
                query.action = 'get';
                
                return request.post(query);
            }
        
            function getEvents(customerId, cId, paging) {
                return listEvents(customerId, [cId], paging).then(function (history) {
                    return (history[0] || {}).EventList;
                });
            }

            function listEvents(customerId, containerIds, paging) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'event';
                query.action = 'get';

                if (paging) {
                    query.Index = paging.index;
                    query.Count = paging.count;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function checkEvents(customerId, containerIds, eventIds) {
                var query = helper.getEventIds(eventIds);
                query.section = 'event';
                query.action = 'check';
                
                return request.post(query);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
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
                },

                event: {
                    get: function (customerId, cId, paging) {
                        return getEvents(customerId, cId, paging);
                    },

                    list: function (customerId, containerIds, paging) {
                        return getEvents(customerId, containerIds, paging);
                    },
                    
                    check: function (customerId, containerIds, eventIds) {
                        return checkEvents(customerId, containerIds, eventIds);
                    }
                }
            };
    }]);
})();