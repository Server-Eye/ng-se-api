"use strict";

angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
  function seaAgentSetting(SeaRequest) {
        var request = new SeaRequest('agent/{aId}/setting/{key}');
      
        function update(setting) {
            return request.put(params);
        }

        function list(aId) {
            return request.get({
                aId: aId
            });
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
            }
        };
}]);
