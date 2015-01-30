"use strict";

angular.module('ngSeApi').factory('sesMeMobilepush', ['SesRequest',
  function sesMeMobilepush(SesRequest) {
        var request = new SesRequest('me/mobilepush/{handle}');

        function list() {
            return request.get();
        }

        function create(params) {
            return request.post(params);
        }

        function get(handle) {
            return request.get({
                handle: handle
            });
        }

        function destroy(handle) {
            return request.del({
                handle: handle
            });
        }

        return {
            list: list,

            /**
             * add mobilepush
             * @param   {Object} params
             * @config  {String} handle
             * @config  {String} type
             * @returns {Object} promise
             */
            create: function(params) {
                return create(params);
            },

            get: function(handle) {
                return get(handle);
            },

            destroy: function(handle) {
                return destroy(handle);
            }
        };
}]);
