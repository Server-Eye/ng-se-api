(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaSearch', ['SeaRequest',
        function seaSearch(SeaRequest) {
            var request = new SeaRequest('search/{sub}');

            function actionlog(params) {
                params = params || {};
                params.sub = 'actionlog';

                return request.post(params);
            }

            return {
                /**
                 * search through actionlog
                 * @param {Object} params
                 * @config {Object} [query]
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 */
                actionlog: function (params) {
                    return actionlog(params);
                }
            };
        }]);
})();