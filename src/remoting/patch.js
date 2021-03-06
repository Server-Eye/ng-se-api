(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatch', ['$http', 'SeaRequest', 'seaRemotingIasHelper', 'seaRemotingPatchHistory', 'seaRemotingPatchInstall', 'seaRemotingPatchReboot', 'seaRemotingPatchScan', 'seaRemotingPatchSoftware',
    function seaRemotingPcvisit($http, SeaRequest, helper, seaRemotingPatchHistory, seaRemotingPatchInstall, seaRemotingPatchReboot, seaRemotingPatchScan, seaRemotingPatchSoftware) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/{section}/{action}'));
            var dateKeys = ["LastScanTime", "LastInstallJobTime", "NextInstallJobTime"];
        
            function format(container) {
                dateKeys.forEach(function (key) {
                    if(container[key]) {
                        container[key] = new Date(container[key]);
                    }
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]);
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
        
            function destroy(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                
                return request.del(query)
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
                deactivate: function (customerId, containerIds) {
                    return destroy(customerId, containerIds);
                },
                
                history: seaRemotingPatchHistory,
                install: seaRemotingPatchInstall,
                reboot: seaRemotingPatchReboot,
                scan: seaRemotingPatchScan,
                software: seaRemotingPatchSoftware
            };
    }]);
})();