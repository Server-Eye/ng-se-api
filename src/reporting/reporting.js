(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReporting', ['SeaRequest',
    function seaCustomer(SeaRequest) {
            var request = new SeaRequest('reporting/{cId}'),
                reportRequest = new SeaRequest('reporting/{cId}/{rId}');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function listHistory(cId, rId) {
                return reportRequest.get({
                    cId: cId,
                    rId: rId
                });
            }

            return {
                list: function () {
                    return list();
                },

                report: {
                    list: function (cId, rId) {
                        return listHistory(cId, rId);
                    }
                }
            };
    }]);
})();