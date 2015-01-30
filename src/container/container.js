"use strict";

angular.module('ngSeApi').factory('sesContainer', ['SesRequest',
                                                   'sesContainerMisc', 'sesContainerNote',
  function sesAgent(SesRequest, sesContainerMisc, sesContainerNote) {
        var request = new SesRequest('container/{cId}');

        function get(cId) {
            return request.get({
                cId: cId
            });
        }

        function update(container) {
            return request.put(container);
        }

        function destroy(cId) {
            return request.del({
                cId: cId
            });
        }

        return {
            get: function (cId) {
                return get(cId);
            },

            /**
             * update container
             * @param {Object} container
             * @config {String} [cId]
             * @config {String} [name]
             * @config {Boolean} [alertOffline]
             * @config {Boolean} [alertShutdown]
             * @config {Number} [maxHeartbeatTimeout]
             */
            update: function (container) {
                return update(container);
            },

            destroy: function (cId) {
                return destroy(cId);
            },

            actionlog: sesContainerMisc.actionlog,
            inventory: sesContainerMisc.inventory,
            note: sesContainerNote,
            pcvisit: sesContainerMisc.pcvisit
        };
}]);
