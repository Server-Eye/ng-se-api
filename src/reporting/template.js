(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReportingTemplate', ['SeaRequest',
        function seaReportingTemplate(SeaRequest) {
            var request = new SeaRequest('reporting/template/{rtId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function get(rId) {
                return reportRequest.get({
                    rtId: rtId
                });
            }

            function destroy(rId) {
                return reportRequest.del({
                    rtId: rtId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                get: function (rtId) {
                    return get(rtId);
                },

                /**
                 * create report template
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Array} [widgets]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (rtId) {
                    return destroy(rtId);
                }
            };
        }]);
})();