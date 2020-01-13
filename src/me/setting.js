(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeSetting', ['SeaRequest',
    function seaMeSetting(SeaRequest) {
            var request = new SeaRequest('me/setting');
            var requestAction = new SeaRequest('me/setting/{action}');

            function list() {
                return request.get();
            }

            function update(settings) {
                settings = settings || {};
                return request.put(settings);
            }

            function resetSecret(password) {
                return requestAction.post({
                    action: 'secret/reset',
                    password: password,
                });
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
                },

                secret: {
                    reset: function(password) {
                        return resetSecret(password);
                    }
                }
            };
    }]);
})();