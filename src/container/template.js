(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTemplate', ['SeaRequest',
    function seaContainerTemplate(SeaRequest) {
            var request = new SeaRequest('container/{cId}/template/{tId}');
            var requestMicroService = new SeaRequest('container/{cId}/template/{tId}', 'v3');

            function create(cId) {
                return requestMicroService.post({
                    cId: cId
                });
            }

            function assign(cId, tId) {
                return request.post({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * create template form system
                 * @param {String} cId
                 */
                create: function (cId) {
                    return create(cId);
                },

                /**
                 * assign a template to a system
                 * @param {String} cId
                 * @param {String} tId
                 */
                assign: function (cId, tId) {
                    return assign(cId, tId);
                }
            };
    }]);
})();