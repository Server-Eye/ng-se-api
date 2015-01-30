"use strict";

angular.module('ngSeApi').factory('sesContainerTemplate', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('container/{cId}/template/{tId}');

        function create(cId) {
            return request.post({
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
