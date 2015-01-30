"use strict";

angular.module('ngSeApi').factory('sesUserSubstitude', ['SesRequest',
  function sesUserSubstitude(SesRequest) {
        var request = new SesRequest('user/{uId}/substitude/{substitudeId}');

        function set(uId, substId) {
            return request.put({
                uId: uId,
                substitudeId: substId
            });
        }

        function remove(uId) {
            return request.del({
                uId: uId
            });
        }

        return {
            /**
             * set a substitude
             * @param {String} gId
             * @param {String} uId
             */
            set: function (uId, substId) {
                return set(uId, substId);
            },

            /**
             * remove substitude
             * @param {String} uId
             */
            remove: function (uId) {
                return remove(uId);
            }
        };
}]);
