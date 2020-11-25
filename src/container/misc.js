(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
        function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');
            var requestMicroService = new SeaRequest('container/{cId}/{action}', 'v3');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch (e) {
                    entry.userName = {
                        email: entry.userName,
                        sur: entry.userName
                    };
                }

                if (entry.information) {
                    try {
                        entry.information = JSON.parse(entry.information);
                    } catch (e) {
                        entry.information = null;
                    }
                }

                return entry;
            }

            function listActionlog(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function listEvents(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'events';
                return request.get(params);
            }

            function getInventory(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'inventory';
                return request.get(params);
            }

            function action(cId, action, params) {
                params = params || {};
                params.cId = cId;
                params.action = action;
                return requestMicroService.post(params);
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

                events: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} end
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listEvents(cId, params);
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
                 * @param   {Int}    until timestamp
                 * @returns {Object} promise
                 */
                stop: function (cId, until) {
                    return action(cId, 'stop', {
                        until: until
                    });
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