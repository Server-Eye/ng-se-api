"use strict";

angular.module('seApi').factory('sesAgentMisc', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('agent/{aId}/{method}');

        function listActionlog(aId, params) {
            params = params || {};
            params.aId = aId;
            params.method = 'actionlog';
            return request.get(params);
        }

        function getChart(aId, params) {
            params = params || {};
            params.aId = aId;
            params.method = 'chart';
            return request.get(params);
        }

        function copy(aId, parentId) {
            var params = {};
            params.aId = aId;
            params.parentId = parentId;
            params.method = 'copy';
            return request.post(params);
        }

        return {
            actionlog: {
                /**
                 * list action log entries
                 * @param   {String} aId    agent id
                 * @param   {Object} params
                 * @config  {Number} start
                 * @config  {Number} limit
                 * @returns {Object} promise
                 */
                list: function (aId, params) {
                    return listActionlog(aId, params);
                }
            },
            chart: {
                /**
                 * get chart config and values
                 * @param   {String} aId    agent id
                 * @param   {Object} params
                 * @config  {Number} start
                 * @config  {Number} limit
                 * @config  {Number} valueType
                 * @returns {Object} promise
                 */
                get: function (aId, params) {
                    return getChart(aId, params);
                }
            },
            /**
             * copy agent to a parent
             * @param   {String} aId      
             * @param   {String}   parentId
             * @returns {Object} promise
             */
            copy: function(aId, parentId) {
                return copy(aId, parentId);
            }
        };
}]);