(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentState', ['SeaRequest',
    function seaAgentState(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/state'),
                hintRequest = new SeaRequest('agent/{aId}/state/{sId}/hint');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);
                
                if(state.silencedUntil) {
                    state.silencedUntil = new Date(state.silencedUntil);
                }
                
                if(state.hints) {
                    angular.forEach(state.hints, formatHint);
                }
                
                return state;
            }
        
            function formatHint(hint) {
                hint.date = new Date(hint.date);
                return hint;
            }

            function hint(params) {
                return hintRequest.post(params).then(formatHint);
            }

            function list(aId, params) {
                params = params || {};
                params.aId = aId;

                if (angular.isArray(params.aId)) {
                    return request.post(params, 'agent/state').then(function (statesById) {
                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });

                        return statesById;
                    });
                }
                return request.get(params).then(function (states) {
                    angular.forEach(states, formatState);

                    return states;
                });
            }

            return {
                /**
                 * create agent state hint
                 * @param {Object} params
                 * @config {String} [aId]
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
                 * list agent states
                 * @param   {String}   aId
                 * @param {Object}
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 * @config {Number} [end]
                 * @config {Boolean} [includeHints]
                 * @config {Boolean} [includeRawData]
                 * @config {String} [format]
                 */
                list: function (aId, params) {
                    return list(aId, params);
                }
            };
    }]);
})();