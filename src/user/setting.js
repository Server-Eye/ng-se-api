"use strict";

angular.module('ngSeApi').factory('seaUserSetting', ['SeaRequest',
  function seaUserSetting(SeaRequest) {
        var request = new SeaRequest('user/{uId}/setting');

        function list(uId) {
            return request.get({
                uId: uId
            });
        }

        function update(uId, settings) {
            settings = settings || {};
            settings.uId = uId;
            return request.put(settings);
        }

        return {
            list: function (uId) {
                return list(uId);
            },

            /**
             * update user
             * @param {String} uId
             * @param {Object} settings
             */
            update: function (uId, settings) {
                return update(uId, settings);
            }
        };
}]);
