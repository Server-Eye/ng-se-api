(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest',
    function seaContainerNote(SeaRequest) {
            var request = new SeaRequest('remoting/{customerId}/{cId}/{action}');

            function format(access) {
                if(access && access.date) {
                    access.data = new Date(access.date);
                }
                
                return access;
            }
        
            function get(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId
                }).then(function (system) {
                    format(system.lastAccess);
                    return system;
                });
            }
        
            function start(params) {
                params = params || {};
                params.action = 'start';
                
                return request.post(params);
            }

            function isInstalled(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'check'
                });
            }

            return {
                get: function(customerId, cId) {
                    return get(customerId, cId);
                },
                
                /**
                 * install pcvisit on remote system
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [cId]
                 * @config {String} [supporterId]
                 * @config {String} [supporterPassword]
                 * @config {String} [user]
                 * @config {String} [domain]
                 * @config {String} [password]
                 */
                installAndStart: function (params) {
                    return start(params);
                },
                
                isInstalled: function (customerId, cId) {
                    return isInstalled(customerId, cId);
                },
                
                getConnectFileLink: function (customerId, cId) {
                    return request.formatUrl({
                        customerId: customerId,
                        cId: cId,
                        action: 'file'
                    });
                }
            };
    }]);
})();