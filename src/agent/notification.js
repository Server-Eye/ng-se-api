"use strict";

angular.module('seApi').factory('sesAgentNotification', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('agent/{aId}/notification/{nId}');

        function create(params) {
            return request.post(params);
        }

        function update(notification) {
            return request.put(notification);
        }

        function list(aId) {
            return request.get({
                aId: aId
            });
        }

        function destroy(aId, nId) {
            return request.del({
                aId: aId,
                nId: nId
            });
        }

        return {
            /**
             * create notification
             * @param {Object} params
             * @config {String} [aId]
             * @config {String} [userId]
             * @config {Boolean} [mail]
             * @config {Boolean} [phone]
             * @config {Boolean} [ticket]
             * @config {String} [deferId]
             */
            create: function (params) {
                return create(params);
            },

            /**
             * update notification
             * @param {Object} params
             * @config {String} [nId]
             * @config {String} [aId]
             * @config {String} [userId]
             * @config {Boolean} [mail]
             * @config {Boolean} [phone]
             * @config {Boolean} [ticket]
             * @config {String} [deferId]
             */
            update: function (notification) {
                return update(notification);
            },

            list: function (aId) {
                return list(aId);
            },

            destroy: function (aId, nId) {
                return destroy(aId, nId);
            }
        };
}]);