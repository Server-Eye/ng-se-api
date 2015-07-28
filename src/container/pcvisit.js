(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerPcvisit', ['SeaRequest',
    function seaContainerNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/pcvisit/{action}');

            function start(params) {
                return request.post(params);
            }

            function isInstalled(cId) {
                return request.get({
                    cId: cId
                });
            }

            return {
                /**
                 * install pcvisit on remote system
                 * @param {Object} params
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
                
                isInstalled: function (cId) {
                    return isInstalled(cId);
                },
                
                getConnectFileLink: function (cId) {
                    return request.formatUrl({
                        cId: cId
                    });
                }
            };
    }]);
})();