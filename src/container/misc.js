"use strict";

angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
  function seaContainerMisc(SeaRequest) {
        var request = new SeaRequest('container/{cId}/{action}');

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

        function connectPcvisit(cId, params) {
            params = params || {};
            params.cId = cId;
            params.action = 'pcvisit';
            return request.get(params);
        }

        return {
            actionlog: {
                /**
                 * list action log entries
                 * @param   {String} cId
                 * @param   {Object} params
                 * @config  {Number} [start]
                 * @config  {Number} [limit]
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
                 * @config {String} [format]
                 * @returns {Object} promise
                 */
                get: function (cId, params) {
                    return getInventory(cId, params);
                }
            },
            pcvisit: {
                /**
                 * install and connect to pcvisit
                 * @param   {String} cId
                 * @param   {Object}   params
                 * @config  {String}   [supporterId]
                 * @config  {String}   [supporterPassword]
                 * @config  {String}   [user]
                 * @config  {String}   [password]
                 * @config  {String}   [domain]
                 * @returns {Object} promise
                 */
                connect: function(cId, params) {
                    return connectPcvisit(cId, params);
                }
            }
        };
}]);
