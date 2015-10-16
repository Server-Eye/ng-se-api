(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchSoftware', ['$http', 'SeaRequest', 'seaRemotingPatchHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest('https://patch.server-eye.de/seias/rest/seocc/patch/1.0/container/software/{action}');

            function get(customerId, cId, params) {
                return list(customerId, [cId], params).then(function (software) {
                    return software[0];
                });
            }

            function list(customerId, containerIds, params) {
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
                /**
                 * list software of container
                 * @param {String} customerId
                 * @param {String} containerId
                 * @param {Object} params
                 * @config {Boolean} [installed]
                 * @config {Boolean} [blocked]
                 */
                get: function (customerId, containerId, params) {
                    return get(customerId, containerId, params);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
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