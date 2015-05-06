(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
    function seaAgentSetting(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/setting/{key}'),
                remoteRequest = new SeaRequest('agent/{aId}/setting/{key}/remote');
        
            function update(setting) {
                return request.put(setting);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }
        
            function remote(param) {
                return remoteRequest.get(param);
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [value]
                 */
                update: function (setting) {
                    return update(setting);
                },

                list: function (aId) {
                    return list(aId);
                },
                
                /**
                 * load settings from remote
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [information]
                 */
                remote: function (param) {
                    return remote(param);
                }
            };
    }]);
})();