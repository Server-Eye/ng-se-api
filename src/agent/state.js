"use strict";

angular.module('seApi').factory('sesAgentState', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('agent/{aId}/state');
      
        function hint(setting) {
            return request.post(params);
        }

        function list(aId, params) {
            params = params || {};
            params.aId = aId;
            
            return request.get(params);
        }

        return {
            /**
             * create agent state hint
             * @param {Object} params
             * @config {String} [aId]
             * @config {String} [sId]
             * @config {String} [author]
             * @config {Number} [hintType]
             * @config {String} [message]
             * @config {String} [assignedUser]
             * @config {Array} [mentionedUsers]
             * @config {Boolean} [private]
             * @config {Number} [until]
             */
            hint: function (params) {
                return hint(params);
            },

            /**
             * list agent states
             * @param   {String}   aId
             * @param {Object} 
             * @config {Number} [limit]
             * @config {Number} [start]
             * @config {Number} [end]
             * @config {Boolean} [includeHints]
             * @config {Boolean} [includeRawData]
             * @config {String} [format]
             */
            list: function (aId, params) {
                return list(aId, params);
            }
        };
}]);