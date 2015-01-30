"use strict";

angular.module('ngSeApi').factory('sesContainerState', ['SesRequest',
  function sesAgent(SesRequest) {
        var request = new SesRequest('container/{cId}/state');

        function hint(setting) {
            return request.post(params);
        }

        function list(cId, params) {
            params = params || {};
            params.cId = cId;

            if(angular.isArray(params.cId)) {
                return request.post(params, 'container/state');
            }
            return request.get(params);
        }

        return {
            /**
             * create container state hint
             * @param {Object} params
             * @config {String} [cId]
             * @config {String} [sId]
             * @config {String} [author]
             * @config {Number} [hintType]
             * @config {String} [message]
             * @config {String} [assignedUser]
             * @config {Array} [mentionedUsers]
             * @config {Boolean} [private]
             * @config {Number} [until]
             */
            hint: function (params) {
                return hint(params);
            },

            /**
             * list container states
             * @param   {String}   cId
             * @param {Object}
             * @config {Number} [limit]
             * @config {Number} [start]
             * @config {Number} [end]
             * @config {Boolean} [includeHints]
             * @config {Boolean} [includeRawData]
             * @config {String} [format]
             */
            list: function (cId, params) {
                return list(cId, params);
            }
        };
}]);
