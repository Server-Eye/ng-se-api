"use strict";

angular.module('ngSeApi').factory('seaAgentMisc', ['SeaRequest',
  function seaAgentMisc(SeaRequest) {
        var request = new SeaRequest('agent/{aId}/{action}');

        function listActionlog(aId, params) {
            params = params || {};
            params.aId = aId;
            params.action = 'actionlog';
            return request.get(params);
        }

        function getChart(aId, params) {
            params = params || {};
            params.aId = aId;
            params.action = 'chart';
            return request.get(params);
        }

        function copy(aId, parentId) {
            var params = {};
            params.aId = aId;
            params.parentId = parentId;
            params.action = 'copy';
            return request.post(params);
        }

        function listCategories() {
            return request.get({}, 'agent/category');
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
            category : {
                list: listCategories
            },
            /**
             * copy agent to a parent
             * @param   {String} aId
             * @param   {String}   parentId
             * @returns {Object} promise
             */
            copy: function (aId, parentId) {
                return copy(aId, parentId);
            }
        };
}]);
