(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatch', ['$http', 'SeaRequest', 'seaAgent',
    function seaRemotingPcvisit($http, SeaRequest, seaAgent) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/{section}/{action}');
        
            function format(container) {
                if(container.LastScanTime) {
                    container.LastScanTime = new Date(container.LastScanTime);
                }
                
                return container;
            }
        
            function getQuery(containerIds) {
                if(!angular.isArray(containerIds)) {
                    containerIds = [containerIds];
                }
                
                var query = containerIds.map(function (containerId) {
                    return {
                        ContainerId: containerId
                    };
                });

                return {
                    ContainerIdList: query
                };
            }
        
            function genericList(params, section) {
                var query = getQuery(params.containerIds);
                query.section = section;
                query.action = 'get';
                
                query.Index = params.page || 0;
                query.Count = params.limit || 10
                
                return request.post(query).then(function (results) {
//                    if(!angular.isArray(params.containerIds)) {
//                        return (results[0] || null);
//                    }
                    
                    return results;
                });
            }

            function get(customerId, cId) {
                return list(customer, [cId]);
            }

            function list(customerId, containerIds) {
                var query = getQuery(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function listSoftware(params) {
                var query = getQuery(params.containerIds);
                query.section = 'software';
                query.action = 'get';
                
                if(params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }
                
                if(params.blocked == null) {
                    query.Blocked = 'BOTH';
                } else {
                    query.Blocked = params.blocked ? 'TRUE' : 'FALSE';
                }
                
                return request.post(query).then(function (softwares) {
                    if(!angular.isArray(params.containerIds)) {
                        return (softwares[0] || null);
                    }
                    
                    return softwares;
                });
            }
        
            function listScans(params) {
                return genericList(params, 'scan');
            }
        
            function listInstall(params) {
                return genericList(params, 'install');
            }
        
            function scheduleInstall(params) {
                var customerId = params.customerId,
                    containerId = params.containerId,
                    categories = params.categories,
                    software = params.software,
                    cron = params.cron;
                
                if(!angular.isArray(containerId)) {
                    containerId = [ containerId ];
                }
                
                var containerConfig = containerId.map(function (cId) {
                    return {
                        ContainerId: cId
                    };
                });
                
                var reqParams = {
                    section: 'install',
                    ContainerIdList: containerConfig,
                    Cron: cron
                };
                
                if(categories) {
                    reqParams.CategoryList = categories;
                }
                if(software) {
                    reqParams.SoftwareIdList = software.map(function (swId) {
                        return {
                            SoftwareId: swId
                        }
                    });
                }
                
                return request.post(reqParams);
            }
        
            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig,
                    cron = params.cron;
                
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
                    ContainerList: containerConfig,
                    Cron: cron
                }).then(function () {
                    containerConfig.forEach(function (config) {
                        seaAgent.create({
                            parentId: config.ContainerId,
                            type: '9537CBB5-9023-4248-AFF3-F1ACCC0CE7A4'
                        }).then(function (agent) {
                            seaAgent.setting.update({
                                aId: agent.aId,
                                key: 'accessToken',
                                value: config.Token
                            });
                        });
                    });
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * list installed/not installed software
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 * @config {boolean} [installed]
                 */
                listSoftware: function (params) {
                    return listSoftware(params);
                },
                
                /**
                 * list scan jobs
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 */
                listScans: function (params) {
                    return listScans(params);
                },
                
                /**
                 * list install jobs
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 */
                listInstall: function (params) {
                    return listInstall(params);
                },
                
                /**
                 * schedule install job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|String} [containerId]
                 * @config {Array} [categories]
                 * @config {Array} [software]
                 * @config {String} [cron]
                 */
                scheduleInstall: function (params) {
                    return scheduleInstall(params);
                },
                
                /**
                 * activate patchmanagement on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 * @config {String} [cron]
                 */
                activate: function (params) {
                    return activate(params);
                }
            };
    }]);
})();