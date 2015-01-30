"use strict";

angular.module('ngSeApi').factory('sesContainerState', ['SesRequest',
  function sesContainerState(SesRequest) {
        var request = new SesRequest('container/{cId}/state');

        function formatState(state) {
            state.date = new Date(state.date);
            state.lastDate = new Date(state.lastDate);
            return state;
        }

        function hint(setting) {
            return request.post(params);
        }

        function list(cId, params) {
            params = params || {};
            params.cId = cId;

            if(angular.isArray(params.cId)) {
                return request.post(params, 'container/state').then(function(statesById) {
                    angular.forEach(Object.keys(statesById), function(key) {
                        angular.forEach(statesById[key], formatState);
                    });
                });
            }
            return request.get(params).then(function(states) {
                angular.forEach(states, formatState);

                return states;
            });
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
