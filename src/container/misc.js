(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
    function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch(e) {
                    entry.userName = {
                        email : entry.userName,
                        sur: entry.userName
                    };
                }
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

            function action(cId, action) {
                var params = {};
                params.cId = cId;
                params.action = action;
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
                    },

                    getFileLink: function (cId, params) {
                        params = params || {};
                        params.cId = cId;
                        params.action = 'inventory';

                        return request.formatUrl(params);
                    }
                },

                /**
                 * restart a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                restart: function (cId) {
                    return action(cId, 'restart');
                },

                /**
                 * stop a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                stop: function (cId) {
                    return action(cId, 'stop');
                },

                /**
                 * start a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                start: function (cId) {
                    return action(cId, 'start');
                }
            };
    }]);
})();