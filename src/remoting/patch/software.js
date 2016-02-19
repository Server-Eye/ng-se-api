(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchSoftware', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/software/{action}'),
                requestSoftware = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/software/{method}/{action}');

            function get(customerId, softwareId) {
                var query = helper.getSoftwareIds(softwareId);
                query.method = 'get';

                return requestSoftware.post(query).then(function (result) { return result[0]; });
            }
        
            function getByContainer(customerId, cId, params) {
                return listByContainer(customerId, [cId], params).then(function (software) {
                    return software[0];
                });
            }

            function listByContainer(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                if (params.blocked == null) {
                    query.Blocked = 'BOTH';
                } else {
                    query.Blocked = params.blocked ? 'TRUE' : 'FALSE';
                }

                return request.post(query);
            }

            function has(customerId, containerIds, softwareIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.SoftwareIdList = helper.getSoftwareIds(softwareIds).SoftwareIdList;
                query.method = 'container';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                return requestSoftware.post(query);
            }

            function block(customerId, containerIds, softwareIds, isBlocked) {
                var query = angular.extend(
                    helper.getContainerIds(containerIds),
                    helper.getSoftwareIds(softwareIds)
                );
                query.action = 'block';
                query.Blocked = isBlocked;

                return request.post(query).then(helper.idListResult);
            }

            return {
                container: {
                    /**
                     * list software of container
                     * @param {String} customerId
                     * @param {String} containerId
                     * @param {Object} params
                     * @config {Boolean} [installed]
                     * @config {Boolean} [blocked]
                     */
                    get: function (customerId, containerId, params) {
                        return getByContainer(customerId, containerId, params);
                    },

                    list: function (customerId, containerIds, params) {
                        return listByContainer(customerId, containerIds, params);
                    }
                },

                get: function(customerId, softwareId) {
                    return get(customerId, softwareId);
                },
                
                /**
                 * find out if a container has a specific software installed
                 * @param {String} customerId
                 * @param {String} containerId
                 * @param {String} softwareId
                 * @param {Object} params
                 * @config {Boolean} [installed]
                 */
                has: function (customerId, containerId, softwareId, params) {
                    return has(customerId, containerId, softwareId, params);
                },

                /**
                 * block software on containers
                 * @param   {String}   customerId   
                 * @param   {String|Array}   containerIds 
                 * @param   {String|Array}   softwareIds  
                 * @param   {Boolean}  isBlocked
                 */
                block: function (customerId, containerIds, softwareIds, isBlocked) {
                    return block(customerId, containerIds, softwareIds, isBlocked);
                }
            };
    }]);
})();