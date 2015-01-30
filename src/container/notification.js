"use strict";

angular.module('ngSeApi').factory('sesContainerNotification', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('container/{cId}/notification/{nId}');

        function create(params) {
            return request.post(params);
        }

        function update(notification) {
            return request.put(notification);
        }

        function list(cId) {
            return request.get({
                cId: cId
            });
        }

        function destroy(cId, nId) {
            return request.del({
                cId: cId,
                nId: nId
            });
        }

        return {
            /**
             * create notification
             * @param {Object} params
             * @config {String} [cId]
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
             * @config {String} [cId]
             * @config {String} [userId]
             * @config {Boolean} [mail]
             * @config {Boolean} [phone]
             * @config {Boolean} [ticket]
             * @config {String} [deferId]
             */
            update: function (notification) {
                return update(notification);
            },

            list: function (cId) {
                return list(cId);
            },

            destroy: function (cId, nId) {
                return destroy(cId, nId);
            }
        };
}]);
