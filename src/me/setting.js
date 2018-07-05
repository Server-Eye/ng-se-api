(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeSetting', ['SeaRequest',
    function seaMeSetting(SeaRequest) {
            var request = new SeaRequest('me/setting');

            function list() {
                return request.get();
            }

            function update(settings) {
                settings = settings || {};
                return request.put(settings);
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {Object} settings
                 */
                update: function (settings) {
                    return update(settings);
                }
            };
    }]);
})();