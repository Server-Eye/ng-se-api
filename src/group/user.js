"use strict";

angular.module('ngSeApi').factory('sesGroupUser', ['SesRequest',
  function sesGroupUser(SesRequest) {
        var request = new SesRequest('group/{gId}/user/{uId}');

        function list(gId) {
            return request.get({
                gId: gId
            });
        }

        function addUser(gId, uId) {
            return request.put(gId, uId);
        }

        function removeUser(gId, uId) {
            return request.del(gId, uId);
        }

        return {
            list: function (gId) {
                return list(gId);
            },

            /**
             * add user to group
             * @param {String} gId
             * @param {String} uId
             */
            add: function (gId, uId) {
                return addUser(gId, uId);
            },

            /**
             * remove user to group
             * @param {String} gId
             * @param {String} uId
             */
            remove: function (gId, uId) {
                return removeUser(gId, uId);
            }
        };
}]);
