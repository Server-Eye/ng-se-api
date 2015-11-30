(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatch', ['$http', 'SeaRequest', 'seaRemotingPatchHelper', 'seaRemotingPatchHistory', 'seaRemotingPatchInstall', 'seaRemotingPatchScan', 'seaRemotingPatchSoftware',
    function seaRemotingPcvisit($http, SeaRequest, helper, seaRemotingPatchHistory, seaRemotingPatchInstall, seaRemotingPatchScan, seaRemotingPatchSoftware) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/{section}/{action}');
        
            function format(container) {
                if(container.LastScanTime) {
                    container.LastScanTime = new Date(container.LastScanTime);
                }
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customer, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
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
                },
                
                history: seaRemotingPatchHistory,
                install: seaRemotingPatchInstall,
                scan: seaRemotingPatchScan,
                software: seaRemotingPatchSoftware
            };
    }]);
})();