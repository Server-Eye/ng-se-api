"use strict";

angular.module('ngSeApi').factory('sesContainerMisc', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('container/{cId}/{action}');

        function listActionlog(cId, params) {
            params = params || {};
            params.cId = cId;
            params.action = 'actionlog';
            return request.get(params);
        }

        function getInventory(cId, params) {
            params = params || {};
            params.cId = cId;
            params.action = 'inventory';
            return request.get(params);
        }

        return {
            actionlog: {
                /**
                 * list action log entries
                 * @param   {String} cId
                 * @param   {Object} params
                 * @config  {Number} start
                 * @config  {Number} limit
                 * @returns {Object} promise
                 */
                list: function (cId, params) {
                    return listActionlog(cId, params);
                }
            },

            inventory: {
                /**
                 * get inventory of the container
                 * @param   {String}   cId
                 * @param   {String}   params
                 * @config {String} format
                 * @returns {Object} promise
                 */
                get: function (cId, params) {
                    return getInventory(cId, params);
                }
            }
        };
}]);
