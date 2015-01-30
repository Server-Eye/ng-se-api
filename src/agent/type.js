"use strict";

angular.module('ngSeApi').factory('sesAgentType', ['SesRequest',
  function sesAgentType(SesRequest) {
        var request = new SesRequest('agent/type');

        function listSettings(akId) {
            return request.get({ akId : akId }, 'agent/type/{akId}/setting');
        }

        function list() {
            return request.get();
        }

        return {
            setting: {
                /**
                 * list settings of an agent type
                 * @param {Object} params
                 * @config {String} [akId]
                 */
                list: function (akId) {
                    return listSettings(akId);
                }
            },

            list: list
        };
}]);
