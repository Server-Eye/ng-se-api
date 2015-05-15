(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
    function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                entry.userName = JSON.parse(entry.userName);
                return entry;
            }
        
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
        
            function restart(cId) {
                var params = {};
                params.cId = cId;
                params.action = 'restart';
                return request.post(params);
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
                        return listActionlog(cId, params).then(function (entries) {
                            angular.forEach(entries, formatActionlog);
                            
                            return entries;
                        });
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
                    connect: function (cId, params) {
                        return connectPcvisit(cId, params);
                    }
                },
                
                /**
                 * restart a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                restart: function(cId) {
                    return restart(cId);
                }
            };
    }]);
})();