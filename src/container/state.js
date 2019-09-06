(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerState', ['SeaRequest',
    function seaContainerState(SeaRequest) {
            var request = new SeaRequest('container/{cId}/state/{method}'),
                hintRequest = new SeaRequest('container/{cId}/state/{sId}/hint');

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
                
                if(hint.until) {
                    hint.until = new Date(hint.until);
                }
                
                return hint;
            }

            function hint(params) {
                return hintRequest.post(params).then(formatHint);
            }
        
            function stats(cId, params) {
                params = params || {};
                params.cId = cId;
                params.method = 'stats';
                
                return request.get(params);
            }

            function list(cId, params) {
                params = params || {};
                params.cId = cId;

                if (angular.isArray(params.cId)) {
                    return request.post(params, 'container/state').then(function (statesById) {
                        if(angular.isArray(statesById)) {
                            var n = {};
                            n[params.cId[0]] = statesById;
                            statesById = n;
                        }

                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });
                    });
                }
                return request.get(params).then(function (states) {
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
                },
                
                /**
                 * list container state stats
                 * @param   {String}   cId
                 * @param {Object}
                 * @config {Number} [start] : now
                 * @config {Number} [end]   : now - 12 months
                 */
                stats: function (cId, params) {
                    return stats(cId, params);
                }
            };
    }]);
})();