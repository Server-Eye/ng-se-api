"use strict";

angular.module('ngSeApi').factory('seaGroupSetting', ['SeaRequest',
  function seaGroupSetting(SeaRequest) {
        var request = new SeaRequest('group/{gId}/setting');

        function list(gId) {
            return request.get({
                gId: gId
            });
        }

        function update(gId, settings) {
            settings = settings || {};
            settings.gId = gId;
            return request.put(settings);
        }

        return {
            list: function (gId) {
                return list(gId);
            },

            /**
             * update group
             * @param {String} gId
             * @param {Object} settings
             */
            update: function (gId, settings) {
                return update(gId, settings);
            }
        };
}]);
