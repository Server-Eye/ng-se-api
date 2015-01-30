"use strict";

angular.module('ngSeApi').factory('sesCustomerDispatchTime', ['SesRequest',
  function sesCustomerDispatchTime(SesRequest) {
        var request = new SesRequest('customer/dispatchTime/{dtId}');

        function create(params) {
            return request.post(params);
        }

        function list() {
            return request.get();
        }

        function update(dispatchTime) {
            return request.put(dispatchTime);
        }

        function destroy(dtId) {
            return request.del({
                dtId: dtId
            });
        }

        return {
            /**
             * create dispatchTime
             * @param {Object} params
             * @config {String} [name]
             * @config {Number} [defer]
             */
            create: function (params) {
                return create(params);
            },

            list: function () {
                return list();
            },

            /**
             * update dispatchTime
             * @param {Object} params
             * @config {String} [dtId]
             * @config {String} [name]
             * @config {Number} [defer]
             */
            update: function (dispatchTime) {
                return update(dispatchTime);
            },

            destroy: function (dtId) {
                return destroy(dtId);
            }
        };
}]);
