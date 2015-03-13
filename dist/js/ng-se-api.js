/**
 * ng-se-api
 * @version 0.2.3
 * @link https://github.com/Server-Eye/ng-se-api.git
 * @license MIT
 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgent', ['SeaRequest',
                                             'seaAgentNote', 'seaAgentNotification', 'seaAgentMisc',
                                             'seaAgentSetting', 'seaAgentState', 'seaAgentType',
    function seaAgent(SeaRequest, seaAgentNote, seaAgentNotification, seaAgentMisc, seaAgentSetting, seaAgentState, seaAgentType) {
            var request = new SeaRequest('agent/{aId}');

            function create(params) {
                return request.post(params);
            }

            function get(aId) {
                return request.get({
                    aId: aId
                });
            }

            function update(agent) {
                return request.put(agent);
            }

            function destroy(aId) {
                return request.del({
                    aId: aId
                });
            }

            return {
                /**
                 * create agent
                 * @param {Object} params
                 * @config {String} [parentId]
                 * @config {String} [type]
                 */
                create: function (params) {
                    return create(params);
                },
                copy: seaAgentMisc.copy,

                get: function (aId) {
                    return get(aId);
                },

                /**
                 * update agent
                 * @param {Object} agent
                 * @config {String} [aId]
                 * @config {String} [name]
                 * @config {Number} [interval]
                 */
                update: function (agent) {
                    return update(agent);
                },

                destroy: function (aId) {
                    return destroy(aId);
                },

                note: seaAgentNote,
                actionlog: seaAgentMisc.actionlog,
                chart: seaAgentMisc.chart,
                notification: seaAgentNotification,
                setting: seaAgentSetting,
                state: seaAgentState,
                category: seaAgentMisc.category,
                type: seaAgentType
            };
    }]);
})();
},{}],2:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentMisc', ['SeaRequest',
    function seaAgentMisc(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/{action}');

            function listActionlog(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function getChart(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'chart';
                return request.get(params);
            }

            function copy(aId, parentId) {
                var params = {};
                params.aId = aId;
                params.parentId = parentId;
                params.action = 'copy';
                return request.post(params);
            }

            function listCategories() {
                return request.get({}, 'agent/category');
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @returns {Object} promise
                     */
                    list: function (aId, params) {
                        return listActionlog(aId, params);
                    }
                },
                chart: {
                    /**
                     * get chart config and values
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @config  {Number} valueType
                     * @returns {Object} promise
                     */
                    get: function (aId, params) {
                        return getChart(aId, params);
                    }
                },
                category: {
                    list: listCategories
                },
                /**
                 * copy agent to a parent
                 * @param   {String} aId
                 * @param   {String}   parentId
                 * @returns {Object} promise
                 */
                copy: function (aId, parentId) {
                    return copy(aId, parentId);
                }
            };
    }]);
})();
},{}],3:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNote', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/note/{nId}');

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return request.post(params).then(formatNote);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }

            function destroy(aId, nId) {
                return request.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
},{}],4:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNotification', ['SeaRequest',
    function seaAgentNitification(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/notification/{nId}');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, nId) {
                return request.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
},{}],5:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
    function seaAgentSetting(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/setting/{key}');

            function update(setting) {
                return request.put(params);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [value]
                 */
                update: function (setting) {
                    return update(setting);
                },

                list: function (aId) {
                    return list(aId);
                }
            };
    }]);
})();
},{}],6:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentState', ['SeaRequest',
    function seaAgentState(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/state');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);
                return state;
            }

            function hint(setting) {
                return request.post(params);
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
},{}],7:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentType', ['SeaRequest',
    function seaAgentType(SeaRequest) {
            var request = new SeaRequest('agent/type');

            function listSettings(akId) {
                return request.get({
                    akId: akId
                }, 'agent/type/{akId}/setting');
            }

            function list() {
                return request.get();
            }

            return {
                setting: {
                    /**
                     * list settings of an agent type
                     * @param {Object} params
                     * @config {String} [akId]
                     */
                    list: function (akId) {
                        return listSettings(akId);
                    }
                },

                list: list
            };
    }]);
})();
},{}],8:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAuth', ['SeaRequest',
    function seaAuth(SeaRequest) {
            var request = new SeaRequest('auth/{action}');

            function createApiKey(params) {
                params = params || {};
                params.action = 'key';

                return request.post(params);
            }

            function login(params) {
                params = params || {};
                params.action = 'login';

                return request.post(params);
            }

            function logout(params) {
                params = params || {};
                params.action = 'logout';

                return request.get(params);
            }

            return {
                /**
                 * create apiKey
                 * @param {Object} params
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Number} [type]
                 * @config {Number} [validUntil]
                 * @config {Number} [maxUses]
                 */
                createApiKey: function (params) {
                    return createApiKey(params);
                },

                /**
                 * login
                 * @param {Object} params
                 * @config {String} [apiKey]
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Boolean} [createApiKey]
                 * @config {String} [apiKeyName]
                 */
                login: function (params) {
                    return login(params);
                },

                logout: function () {
                    return logout();
                }
            };
    }]);
})();
},{}],9:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider', function SeaConfigProvider($httpProvider) {
        var config = {
            baseUrl: 'https://api.server-eye.de',
            apiVersion: 2,
            apiKey: null,
            getUrl: function (path) {
                return [this.baseUrl, this.apiVersion, path].join('/');
            }
        };

        $httpProvider.interceptors.push(function () {
            return {
                'request': function (reqConfig) {
                    if (config.apiKey) {
                        reqConfig.headers['x-api-key'] = config.apiKey;
                    }

                    return reqConfig;
                },

                'response': function (response) {
                    return response;
                }
            };
        });

        this.setBaseUrl = function (baseUrl) {
            config.baseUrl = baseUrl;
        }

        this.setApiVersion = function (apiVersion) {
            config.apiVersion = apiVersion;
        }

        this.setApiKey = function (apiKey) {
            config.apiKey = apiKey;
        }

        this.$get = function ($http) {
            return {
                getBaseUrl: function () {
                    return config.baseUrl;
                },
                getApiVersion: function () {
                    return config.apiVersion;
                },
                getApiKey: function () {
                    return config.apiKey;
                },
                setApiKey: function (apiKey) {
                    config.apiKey = apiKey;
                },
                getUrl: function (path) {
                    return [config.baseUrl, config.apiVersion, path].join('/');
                }
            }
        };
    }]);
})();
},{}],10:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainer', ['SeaRequest',
                                                   'seaContainerMisc', 'seaContainerNote', 'seaContainerNotification',
                                                   'seaContainerProposal', 'seaContainerState', 'seaContainerTemplate',
    function seaContainer(SeaRequest, seaContainerMisc, seaContainerNote, seaContainerNotification, seaContainerProposal, seaContainerState, seaContainerTemplate) {
            var request = new SeaRequest('container/{cId}');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(container) {
                return request.put(container);
            }

            function destroy(cId) {
                return request.del({
                    cId: cId
                });
            }

            return {
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update container
                 * @param {Object} container
                 * @config {String} [cId]
                 * @config {String} [name]
                 * @config {Boolean} [alertOffline]
                 * @config {Boolean} [alertShutdown]
                 * @config {Number} [maxHeartbeatTimeout]
                 */
                update: function (container) {
                    return update(container);
                },

                destroy: function (cId) {
                    return destroy(cId);
                },

                actionlog: seaContainerMisc.actionlog,
                inventory: seaContainerMisc.inventory,
                note: seaContainerNote,
                notification: seaContainerNotification,
                pcvisit: seaContainerMisc.pcvisit,
                proposal: seaContainerProposal,
                state: seaContainerState,
                template: seaContainerTemplate
            };
    }]);
})();
},{}],11:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
    function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');

            function listActionlog(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function getInventory(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'inventory';
                return request.get(params);
            }

            function connectPcvisit(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'pcvisit';
                return request.get(params);
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} [start]
                     * @config  {Number} [limit]
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listActionlog(cId, params);
                    }
                },

                inventory: {
                    /**
                     * get inventory of the container
                     * @param   {String}   cId
                     * @param   {String}   params
                     * @config {String} [format]
                     * @returns {Object} promise
                     */
                    get: function (cId, params) {
                        return getInventory(cId, params);
                    }
                },
                pcvisit: {
                    /**
                     * install and connect to pcvisit
                     * @param   {String} cId
                     * @param   {Object}   params
                     * @config  {String}   [supporterId]
                     * @config  {String}   [supporterPassword]
                     * @config  {String}   [user]
                     * @config  {String}   [password]
                     * @config  {String}   [domain]
                     * @returns {Object} promise
                     */
                    connect: function (cId, params) {
                        return connectPcvisit(cId, params);
                    }
                }
            };
    }]);
})();
},{}],12:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNote', ['SeaRequest',
    function seaContainerNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/note/{nId}');

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return request.post(params).then(formatNote);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }

            function destroy(cId, nId) {
                return request.del({
                    aId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create note
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
},{}],13:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNotification', ['SeaRequest',
    function seaContainerNotification(SeaRequest) {
            var request = new SeaRequest('container/{cId}/notification/{nId}');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, nId) {
                return request.del({
                    cId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
},{}],14:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerProposal', ['SeaRequest',
    function seaContainerProposal(SeaRequest) {
            var request = new SeaRequest('container/{cId}/proposal/{pId}');

            function accept(cId, pId) {
                return request.put({
                    cId: cId,
                    pId: pId
                });
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function deny(cId, pId) {
                return request.del({
                    cId: cId,
                    pId: pId
                });
            }

            function listSettings(cId, pId) {
                return request.get({
                    cId: cId,
                    pId: pId
                }, 'container/{cId}/proposal/{pId}/setting');
            }

            return {
                accept: function (cId, pId) {
                    return accept(cId, pId);
                },

                list: function (cId) {
                    return list(cId);
                },

                deny: function (cId, pId) {
                    return deny(cId, pId);
                },

                settings: {
                    list: function (cId, pId) {
                        return listSettings(cId, pId);
                    }
                }
            };
    }]);
})();
},{}],15:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerState', ['SeaRequest',
    function seaContainerState(SeaRequest) {
            var request = new SeaRequest('container/{cId}/state');

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

                if (angular.isArray(params.cId)) {
                    return request.post(params, 'container/state').then(function (statesById) {
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
                }
            };
    }]);
})();
},{}],16:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTemplate', ['SeaRequest',
    function seaContainerTemplate(SeaRequest) {
            var request = new SeaRequest('container/{cId}/template/{tId}');

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
})();
},{}],17:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerSetting', 'seaCustomerDispatchTime', 'seaCustomerTag',
    function seaCustomer(SeaRequest, seaCustomerSetting, seaCustomerDispatchTime, seaCustomerTag) {
            var request = new SeaRequest('customer/{cId}');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(customer) {
                return request.put(customer);
            }

            return {
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update customer
                 * @param {Object} customer
                 * @config {String} [cId]
                 * @config {String} [country]
                 * @config {Number} [customerNumberIntern]
                 * @config {Number} [customerNumberExtern]
                 * @config {String} [companyName]
                 * @config {String} [street]
                 * @config {String} [zipCode]
                 * @config {String} [city]
                 * @config {String} [email]
                 * @config {String} [phone]
                 */
                update: function (customer) {
                    return update(customer);
                },

                setting: seaCustomerSetting,
                dispatchTime: seaCustomerDispatchTime,
                tag: seaCustomerTag
            };
    }]);
})();
},{}],18:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerDispatchTime', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/dispatchTime/{dtId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(dispatchTime) {
                return request.put(dispatchTime);
            }

            function destroy(dtId) {
                return request.del({
                    dtId: dtId
                });
            }

            return {
                /**
                 * create dispatchTime
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update dispatchTime
                 * @param {Object} params
                 * @config {String} [dtId]
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                update: function (dispatchTime) {
                    return update(dispatchTime);
                },

                destroy: function (dtId) {
                    return destroy(dtId);
                }
            };
    }]);
})();
},{}],19:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerSetting', ['SeaRequest',
    function seaCustomerSetting(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/setting');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(cId, settings) {
                settings = settings || {};
                settings.cId = cId;
                return request.put(settings);
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * update customer
                 * @param {String} cId
                 * @param {Object} settings
                 */
                update: function (cId, settings) {
                    return update(cId, settings);
                }
            };
    }]);
})();
},{}],20:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerTag', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/tag/{tId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(tag) {
                return request.put(disptagatchTime);
            }

            function destroy(tId) {
                return request.del({
                    tId: tId
                });
            }

            return {
                /**
                 * create a tag
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update tag
                 * @param {Object} params
                 * @config {String} [tId]
                 * @config {String} [name]
                 */
                update: function (tag) {
                    return update(tag);
                },

                destroy: function (tId) {
                    return destroy(tId);
                }
            };
    }]);
})();
},{}],21:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroup', ['SeaRequest', 'seaGroupSetting', 'seaGroupUser',
    function seaGroup(SeaRequest, seaGroupSetting, seaGroupUser) {
            var request = new SeaRequest('group/{gId}');

            function create(params) {
                return request.post(params);
            }

            function get(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(group) {
                return request.put(group);
            }

            function destroy(gId) {
                return request.del({
                    gId: gId
                });
            }

            return {
                /**
                 * create group
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update group
                 * @param {Object} group
                 * @config {String} [gId]
                 * @config {String} [name]
                 */
                update: function (group) {
                    return update(group);
                },

                destroy: function (gId) {
                    return destroy(gId);
                },

                setting: seaGroupSetting,
                user: seaGroupUser
            };
    }]);
})();
},{}],22:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupSetting', ['SeaRequest',
    function seaGroupSetting(SeaRequest) {
            var request = new SeaRequest('group/{gId}/setting');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(gId, settings) {
                settings = settings || {};
                settings.gId = gId;
                return request.put(settings);
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * update group
                 * @param {String} gId
                 * @param {Object} settings
                 */
                update: function (gId, settings) {
                    return update(gId, settings);
                }
            };
    }]);
})();
},{}],23:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupUser', ['SeaRequest',
    function seaGroupUser(SeaRequest) {
            var request = new SeaRequest('group/{gId}/user/{uId}');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function addUser(gId, uId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(gId, uId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (gId, uId) {
                    return addUser(gId, uId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (gId, uId) {
                    return removeUser(gId, uId);
                }
            };
    }]);
})();
},{}],24:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMe', ['SeaRequest', 'seaMeMobilepush', 'seaMeNotification',
    function seaMe(SeaRequest, seaMeMobilepush, seaMeNotification) {
            var request = new SeaRequest('me/{action}');

            function _formatNode(node) {
                if (node.date && typeof (node.date) === 'string') {
                    node.date = new Date(node.date);
                }

                if (node.lastDate && typeof (node.lastDate) === 'string') {
                    node.lastDate = new Date(node.lastDate);
                }

                return node;
            }

            function _formatData(data) {
                var idx = data.indexOf('loadfinish');
                if (idx >= 0) {
                    data.splice(idx, 1);
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    _formatNode(data[i]);
                }

                return data;
            }

            function me() {
                return request.get();
            }

            function customer() {
                return request.get({
                    action: 'customer'
                });
            }

            function feed(params) {
                params = params || {};
                params.action = 'feed';

                return request.get(params);
            }

            function key(name) {
                return request.get({
                    action: 'key',
                    name: name
                });
            }

            function nodes(params) {
                params = params || {};
                params.action = 'nodes';

                return request.get(params).then(_formatData);
            }

            return {
                me: me,
                customer: customer,
                feed: function (params) {
                    return feed(params);
                },
                key: function (name) {
                    return key(name);
                },
                nodes: function (params) {
                    return nodes(params);
                },

                mobilepush: seaMeMobilepush,
                notification: seaMeNotification
            };
    }]);
})();
},{}],25:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeMobilepush', ['SeaRequest',
    function seaMeMobilepush(SeaRequest) {
            var request = new SeaRequest('me/mobilepush/{handle}');

            function list() {
                return request.get();
            }

            function create(params) {
                return request.post(params);
            }

            function get(handle) {
                return request.get({
                    handle: handle
                });
            }

            function destroy(handle) {
                return request.del({
                    handle: handle
                });
            }

            return {
                list: list,

                /**
                 * add mobilepush
                 * @param   {Object} params
                 * @config  {String} handle
                 * @config  {String} type
                 * @returns {Object} promise
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (handle) {
                    return get(handle);
                },

                destroy: function (handle) {
                    return destroy(handle);
                }
            };
  }]);
})();
},{}],26:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeNotification', ['SeaRequest',
    function seaMeNotification(SeaRequest) {
            var request = new SeaRequest('me/notification/{nId}');

            function list(params) {
                return request.get(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function destroy(nId) {
                return request.del({
                    nId: nId
                });
            }

            return {
                /**
                 * list all notifications
                 * @param   {Object} params
                 * @config  {Boolean}  includeGroups
                 * @returns {Object} promise
                 */
                list: function (params) {
                    return list(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId || aId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return get(notification);
                },

                destroy: function (nId) {
                    return destroy(nId);
                }
            };
    }]);
})();
},{}],27:[function(require,module,exports){
(function () {
    "use strict";
    
    angular.module('ngSeApi', []);

    angular.module('ngSeApi').config(['seaConfigProvider', function (seaApiConfigProvider) {
        
    }]);
})();

},{}],28:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaRequest', ['seaConfig', '$q', '$http',
    function SeaRequest(seaConfig, $q, $http) {
            function SeaRequest(urlPath) {
                this.urlPath = urlPath;
            }

            /**
             * Merges url and params to a valid api url path.
             *
             * <pre><code>
             * url = '/agent/:aId'
             * params = { aId: 'test-agent-id', name: 'test agent' }
             *
             * url = formatUrl(urlPath, params)
             * url == '/agent/test-agent-id'
             * </pre></code>
             *
             * @param   {String} url    url template
             * @param   {Object} params request parameters
             * @returns {String}
             */
            SeaRequest.prototype.formatUrl = function formatUrl(url, params) {
                params = params || {};

                var keys = Object.keys(params),
                    i = keys.length;

                while (i--) {
                    var regex = new RegExp('\\{' + keys[i] + '\\}', 'gm');
                    if (regex.test(url)) {
                        url = url.replace(regex, params[keys[i]]);
                        delete params[keys[i]];
                    }
                }

                url = url.replace(/\/{[a-z0-9]*}$/i, '');

                return url;
            }

            SeaRequest.prototype.send = function send(method, params, urlPath) {
                var fullUrl = seaConfig.getUrl(urlPath || this.urlPath),
                    deferred = $q.defer(),
                    conf = {
                        method: method
                    };

                params = angular.copy(params);
                conf.url = this.formatUrl(fullUrl, params);

                if (method === 'POST' || method === 'PUT') {
                    conf.data = params || {};
                } else {
                    conf.params = params || {};
                }

                $http(conf).then(function (resp) {
                    deferred.resolve(resp.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            /**
             * perform GET request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.get = function get(params, urlPath) {
                return this.send('GET', params, urlPath);
            }

            /**
             * perform POST request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.post = function get(params, urlPath) {
                return this.send('POST', params, urlPath);
            }

            /**
             * perform PUT request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.put = function get(params, urlPath) {
                return this.send('PUT', params, urlPath);
            }

            /**
             * perform DELETE request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.del = function get(params, urlPath) {
                return this.send('DELETE', params, urlPath);
            }

            return SeaRequest;
    }]);
})();
},{}],29:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserGroup', ['SeaRequest',
    function seaUserGroup(SeaRequest) {
            var request = new SeaRequest('user/{uId}/group/{gId}');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function addUser(uId, gId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(uId, gId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (uId, gId) {
                    return addUser(uId, gId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (uId, gId) {
                    return removeUser(uId, gId);
                }
            };
    }]);
})();
},{}],30:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSetting', ['SeaRequest',
    function seaUserSetting(SeaRequest) {
            var request = new SeaRequest('user/{uId}/setting');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(uId, settings) {
                settings = settings || {};
                settings.uId = uId;
                return request.put(settings);
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {String} uId
                 * @param {Object} settings
                 */
                update: function (uId, settings) {
                    return update(uId, settings);
                }
            };
    }]);
})();
},{}],31:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSubstitude', ['SeaRequest',
    function seaUserSubstitude(SeaRequest) {
            var request = new SeaRequest('user/{uId}/substitude/{substitudeId}');

            function set(uId, substId) {
                return request.put({
                    uId: uId,
                    substitudeId: substId
                });
            }

            function remove(uId) {
                return request.del({
                    uId: uId
                });
            }

            return {
                /**
                 * set a substitude
                 * @param {String} gId
                 * @param {String} uId
                 */
                set: function (uId, substId) {
                    return set(uId, substId);
                },

                /**
                 * remove substitude
                 * @param {String} uId
                 */
                remove: function (uId) {
                    return remove(uId);
                }
            };
    }]);
})();
},{}],32:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserSetting', 'seaUserSubstitude',
    function seaUser(SeaRequest, seaUserGroup, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}');

            function create(params) {
                return request.post(params);
            }

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(user) {
                return request.put(user);
            }

            function destroy(uId) {
                return request.del({
                    uId: uId
                });
            }

            function search(params) {
                return request.get(params);
            }

            return {
                /**
                 * create user
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update user
                 * @param {Object} user
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                update: function (user) {
                    return update(user);
                },

                destroy: function (uId) {
                    return destroy(uId);
                },

                /**
                 * search users
                 * @param   {Object}   params
                 * @config  {String}   [query]
                 * @config  {String}   [customerId]
                 * @config  {Boolean}  [includeLocation]
                 */
                search: function (params) {
                    return search(params);
                },

                setting: seaUserSetting,
                group: seaUserGroup,
                substitude: seaUserSubstitude
            };
    }]);
})();
},{}]},{},[27,9,28,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,19,18,20,24,25,26,21,22,23,32,30,29,31])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4uXFxhZ2VudFxcYWdlbnQuanMiLCIuLlxcYWdlbnRcXG1pc2MuanMiLCIuLlxcYWdlbnRcXG5vdGUuanMiLCIuLlxcYWdlbnRcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxhZ2VudFxcc2V0dGluZy5qcyIsIi4uXFxhZ2VudFxcc3RhdGUuanMiLCIuLlxcYWdlbnRcXHR5cGUuanMiLCIuLlxcYXV0aFxcYXV0aC5qcyIsIi4uXFxjb25maWcuanMiLCIuLlxcY29udGFpbmVyXFxjb250YWluZXIuanMiLCIuLlxcY29udGFpbmVyXFxtaXNjLmpzIiwiLi5cXGNvbnRhaW5lclxcbm90ZS5qcyIsIi4uXFxjb250YWluZXJcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxjb250YWluZXJcXHByb3Bvc2FsLmpzIiwiLi5cXGNvbnRhaW5lclxcc3RhdGUuanMiLCIuLlxcY29udGFpbmVyXFx0ZW1wbGF0ZS5qcyIsIi4uXFxjdXN0b21lclxcY3VzdG9tZXIuanMiLCIuLlxcY3VzdG9tZXJcXGRpc3BhdGNoVGltZS5qcyIsIi4uXFxjdXN0b21lclxcc2V0dGluZy5qcyIsIi4uXFxjdXN0b21lclxcdGFnLmpzIiwiLi5cXGdyb3VwXFxncm91cC5qcyIsIi4uXFxncm91cFxcc2V0dGluZy5qcyIsIi4uXFxncm91cFxcdXNlci5qcyIsIi4uXFxtZVxcbWUuanMiLCIuLlxcbWVcXG1vYmlsZXB1c2guanMiLCIuLlxcbWVcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxtb2R1bGUuanMiLCIuLlxccmVxdWVzdC5qcyIsIi4uXFx1c2VyXFxncm91cC5qcyIsIi4uXFx1c2VyXFxzZXR0aW5nLmpzIiwiLi5cXHVzZXJcXHN1YnN0aXR1ZGUuanMiLCIuLlxcdXNlclxcdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnQnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2VhQWdlbnROb3RlJywgJ3NlYUFnZW50Tm90aWZpY2F0aW9uJywgJ3NlYUFnZW50TWlzYycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFBZ2VudFNldHRpbmcnLCAnc2VhQWdlbnRTdGF0ZScsICdzZWFBZ2VudFR5cGUnLFxyXG4gICAgZnVuY3Rpb24gc2VhQWdlbnQoU2VhUmVxdWVzdCwgc2VhQWdlbnROb3RlLCBzZWFBZ2VudE5vdGlmaWNhdGlvbiwgc2VhQWdlbnRNaXNjLCBzZWFBZ2VudFNldHRpbmcsIHNlYUFnZW50U3RhdGUsIHNlYUFnZW50VHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGFnZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoYWdlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGFJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFyZW50SWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt0eXBlXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29weTogc2VhQWdlbnRNaXNjLmNvcHksXHJcblxyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChhSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBhZ2VudFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGFnZW50XHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbaW50ZXJ2YWxdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGFnZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShhZ2VudCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChhSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShhSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBub3RlOiBzZWFBZ2VudE5vdGUsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25sb2c6IHNlYUFnZW50TWlzYy5hY3Rpb25sb2csXHJcbiAgICAgICAgICAgICAgICBjaGFydDogc2VhQWdlbnRNaXNjLmNoYXJ0LFxyXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBzZWFBZ2VudE5vdGlmaWNhdGlvbixcclxuICAgICAgICAgICAgICAgIHNldHRpbmc6IHNlYUFnZW50U2V0dGluZyxcclxuICAgICAgICAgICAgICAgIHN0YXRlOiBzZWFBZ2VudFN0YXRlLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHNlYUFnZW50TWlzYy5jYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHNlYUFnZW50VHlwZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50TWlzYycsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFBZ2VudE1pc2MoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS97YWN0aW9ufScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEFjdGlvbmxvZyhhSWQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnYWN0aW9ubG9nJztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRDaGFydChhSWQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnY2hhcnQnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvcHkoYUlkLCBwYXJlbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5wYXJlbnRJZCA9IHBhcmVudElkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdjb3B5JztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdENhdGVnb3JpZXMoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe30sICdhZ2VudC9jYXRlZ29yeScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogbGlzdCBhY3Rpb24gbG9nIGVudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBhSWQgICAgYWdlbnQgaWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBzdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IGxpbWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdEFjdGlvbmxvZyhhSWQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogZ2V0IGNoYXJ0IGNvbmZpZyBhbmQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gYUlkICAgIGFnZW50IGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBsaW1pdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IHZhbHVlVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhSWQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhcnQoYUlkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGxpc3RDYXRlZ29yaWVzXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjb3B5IGFnZW50IHRvIGEgcGFyZW50XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBhSWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgcGFyZW50SWRcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29weTogZnVuY3Rpb24gKGFJZCwgcGFyZW50SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29weShhSWQsIHBhcmVudElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudE5vdGUnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQWdlbnROb3RlKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vbm90ZS97bklkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZm9ybWF0Tm90ZShub3RlKSB7XHJcbiAgICAgICAgICAgICAgICBub3RlLnBvc3RlZE9uID0gbmV3IERhdGUobm90ZS5wb3N0ZWRPbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm90ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpLnRoZW4oZm9ybWF0Tm90ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChub3Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub3RlcywgZm9ybWF0Tm90ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub3RlcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGFJZCwgbklkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5JZDogbklkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGFnZW50IG5vdGVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChhSWQsIG5JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGFJZCwgbklkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudE5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQWdlbnROaXRpZmljYXRpb24oU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vbm90aWZpY2F0aW9uL3tuSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGFJZCwgbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWQsXG4gICAgICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3VzZXJJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGFJZCwgbklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGFJZCwgbklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRTZXR0aW5nJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFBZ2VudFNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vc2V0dGluZy97a2V5fScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoc2V0dGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGFJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGFnZW50IG5vdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2tleV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt2YWx1ZV1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoc2V0dGluZyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRTdGF0ZScsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQWdlbnRTdGF0ZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9zdGF0ZScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmRhdGUgPSBuZXcgRGF0ZShzdGF0ZS5kYXRlKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmxhc3REYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhpbnQoc2V0dGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYUlkID0gYUlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuYUlkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcywgJ2FnZW50L3N0YXRlJykudGhlbihmdW5jdGlvbiAoc3RhdGVzQnlJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKE9iamVjdC5rZXlzKHN0YXRlc0J5SWQpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlc0J5SWRba2V5XSwgZm9ybWF0U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZXNCeUlkO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihmdW5jdGlvbiAoc3RhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXMsIGZvcm1hdFN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudCBzdGF0ZSBoaW50XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXV0aG9yXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2hpbnRUeXBlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXNzaWduZWRVc2VyXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0FycmF5fSBbbWVudGlvbmVkVXNlcnNdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3ByaXZhdGVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbdW50aWxdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaGludDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGludChwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBsaXN0IGFnZW50IHN0YXRlc1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgYUlkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbbGltaXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbc3RhcnRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZW5kXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlSGludHNdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVSYXdEYXRhXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Zvcm1hdF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudFR5cGUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUFnZW50VHlwZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC90eXBlJyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RTZXR0aW5ncyhha0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgYWtJZDogYWtJZFxuICAgICAgICAgICAgICAgIH0sICdhZ2VudC90eXBlL3tha0lkfS9zZXR0aW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2V0dGluZzoge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogbGlzdCBzZXR0aW5ncyBvZiBhbiBhZ2VudCB0eXBlXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYWtJZF1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChha0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFNldHRpbmdzKGFrSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBdXRoJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFBdXRoKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2F1dGgve2FjdGlvbn0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlQXBpS2V5KHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2tleSc7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ2luKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2xvZ2luJztcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9nb3V0KHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2xvZ291dCc7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgYXBpS2V5XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bhc3N3b3JkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3R5cGVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbdmFsaWRVbnRpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFttYXhVc2VzXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZUFwaUtleTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQXBpS2V5KHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGxvZ2luXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FwaUtleV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwYXNzd29yZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbY3JlYXRlQXBpS2V5XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FwaUtleU5hbWVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvZ2luKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxvZ291dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLnByb3ZpZGVyKCdzZWFDb25maWcnLCBbJyRodHRwUHJvdmlkZXInLCBmdW5jdGlvbiBTZWFDb25maWdQcm92aWRlcigkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnNlcnZlci1leWUuZGUnLFxyXG4gICAgICAgICAgICBhcGlWZXJzaW9uOiAyLFxyXG4gICAgICAgICAgICBhcGlLZXk6IG51bGwsXHJcbiAgICAgICAgICAgIGdldFVybDogZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbdGhpcy5iYXNlVXJsLCB0aGlzLmFwaVZlcnNpb24sIHBhdGhdLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgJ3JlcXVlc3QnOiBmdW5jdGlvbiAocmVxQ29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5hcGlLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxQ29uZmlnLmhlYWRlcnNbJ3gtYXBpLWtleSddID0gY29uZmlnLmFwaUtleTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXFDb25maWc7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICdyZXNwb25zZSc6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRCYXNlVXJsID0gZnVuY3Rpb24gKGJhc2VVcmwpIHtcclxuICAgICAgICAgICAgY29uZmlnLmJhc2VVcmwgPSBiYXNlVXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRBcGlWZXJzaW9uID0gZnVuY3Rpb24gKGFwaVZlcnNpb24pIHtcclxuICAgICAgICAgICAgY29uZmlnLmFwaVZlcnNpb24gPSBhcGlWZXJzaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRBcGlLZXkgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5hcGlLZXkgPSBhcGlLZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbiAoJGh0dHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGdldEJhc2VVcmw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLmJhc2VVcmw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0QXBpVmVyc2lvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcuYXBpVmVyc2lvbjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXRBcGlLZXk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLmFwaUtleTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXRBcGlLZXk6IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25maWcuYXBpS2V5ID0gYXBpS2V5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGdldFVybDogZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvbmZpZy5iYXNlVXJsLCBjb25maWcuYXBpVmVyc2lvbiwgcGF0aF0uam9pbignLycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXInLCBbJ1NlYVJlcXVlc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlYUNvbnRhaW5lck1pc2MnLCAnc2VhQ29udGFpbmVyTm90ZScsICdzZWFDb250YWluZXJOb3RpZmljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlYUNvbnRhaW5lclByb3Bvc2FsJywgJ3NlYUNvbnRhaW5lclN0YXRlJywgJ3NlYUNvbnRhaW5lclRlbXBsYXRlJyxcbiAgICBmdW5jdGlvbiBzZWFDb250YWluZXIoU2VhUmVxdWVzdCwgc2VhQ29udGFpbmVyTWlzYywgc2VhQ29udGFpbmVyTm90ZSwgc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uLCBzZWFDb250YWluZXJQcm9wb3NhbCwgc2VhQ29udGFpbmVyU3RhdGUsIHNlYUNvbnRhaW5lclRlbXBsYXRlKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0KGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGNJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2FsZXJ0T2ZmbGluZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbYWxlcnRTaHV0ZG93bl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFttYXhIZWFydGJlYXRUaW1lb3V0XVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koY0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiBzZWFDb250YWluZXJNaXNjLmFjdGlvbmxvZyxcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnk6IHNlYUNvbnRhaW5lck1pc2MuaW52ZW50b3J5LFxuICAgICAgICAgICAgICAgIG5vdGU6IHNlYUNvbnRhaW5lck5vdGUsXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBzZWFDb250YWluZXJOb3RpZmljYXRpb24sXG4gICAgICAgICAgICAgICAgcGN2aXNpdDogc2VhQ29udGFpbmVyTWlzYy5wY3Zpc2l0LFxuICAgICAgICAgICAgICAgIHByb3Bvc2FsOiBzZWFDb250YWluZXJQcm9wb3NhbCxcbiAgICAgICAgICAgICAgICBzdGF0ZTogc2VhQ29udGFpbmVyU3RhdGUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHNlYUNvbnRhaW5lclRlbXBsYXRlXG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyTWlzYycsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyTWlzYyhTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0ve2FjdGlvbn0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEFjdGlvbmxvZyhjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnYWN0aW9ubG9nJztcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SW52ZW50b3J5KGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdpbnZlbnRvcnknO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjb25uZWN0UGN2aXNpdChjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAncGN2aXNpdCc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBsaXN0IGFjdGlvbiBsb2cgZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBjSWRcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IFtzdGFydF1cbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gW2xpbWl0XVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0QWN0aW9ubG9nKGNJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBpbnZlbnRvcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGdldCBpbnZlbnRvcnkgb2YgdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGNJZFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIHBhcmFtc1xuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtmb3JtYXRdXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0SW52ZW50b3J5KGNJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGN2aXNpdDoge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogaW5zdGFsbCBhbmQgY29ubmVjdCB0byBwY3Zpc2l0XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IGNJZFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHBhcmFtc1xuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtzdXBwb3J0ZXJJZF1cbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbc3VwcG9ydGVyUGFzc3dvcmRdXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3VzZXJdXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3Bhc3N3b3JkXVxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtkb21haW5dXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3RQY3Zpc2l0KGNJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJOb3RlJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFDb250YWluZXJOb3RlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9ub3RlL3tuSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdE5vdGUobm90ZSkge1xuICAgICAgICAgICAgICAgIG5vdGUucG9zdGVkT24gPSBuZXcgRGF0ZShub3RlLnBvc3RlZE9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm90ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKS50aGVuKGZvcm1hdE5vdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobm90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5vdGVzLCBmb3JtYXROb3RlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkLCBuSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBhSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICAgICAgbklkOiBuSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgbm90ZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbWVzc2FnZV1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGNJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChjSWQsIG5JZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShjSWQsIG5JZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lck5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9ub3RpZmljYXRpb24ve25JZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkLCBuSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICAgICAgbklkOiBuSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt1c2VySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25JZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkLCBuSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koY0lkLCBuSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJQcm9wb3NhbCcsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyUHJvcG9zYWwoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9L3Byb3Bvc2FsL3twSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFjY2VwdChjSWQsIHBJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkLFxuICAgICAgICAgICAgICAgICAgICBwSWQ6IHBJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlbnkoY0lkLCBwSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICAgICAgcElkOiBwSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdFNldHRpbmdzKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgICAgIHBJZDogcElkXG4gICAgICAgICAgICAgICAgfSwgJ2NvbnRhaW5lci97Y0lkfS9wcm9wb3NhbC97cElkfS9zZXR0aW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYWNjZXB0OiBmdW5jdGlvbiAoY0lkLCBwSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdChjSWQsIHBJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVueTogZnVuY3Rpb24gKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZW55KGNJZCwgcElkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFNldHRpbmdzKGNJZCwgcElkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJTdGF0ZScsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyU3RhdGUoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9L3N0YXRlJyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdFN0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuZGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmRhdGUpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3REYXRlID0gbmV3IERhdGUoc3RhdGUubGFzdERhdGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gaGludChzZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHBhcmFtcy5jSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zLCAnY29udGFpbmVyL3N0YXRlJykudGhlbihmdW5jdGlvbiAoc3RhdGVzQnlJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKE9iamVjdC5rZXlzKHN0YXRlc0J5SWQpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlc0J5SWRba2V5XSwgZm9ybWF0U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlcywgZm9ybWF0U3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZXM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGNvbnRhaW5lciBzdGF0ZSBoaW50XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXV0aG9yXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2hpbnRUeXBlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXNzaWduZWRVc2VyXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0FycmF5fSBbbWVudGlvbmVkVXNlcnNdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3ByaXZhdGVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbdW50aWxdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaGludDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGludChwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBsaXN0IGNvbnRhaW5lciBzdGF0ZXNcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGNJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2xpbWl0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3N0YXJ0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2VuZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbaW5jbHVkZUhpbnRzXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlUmF3RGF0YV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtmb3JtYXRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGNJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyVGVtcGxhdGUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lclRlbXBsYXRlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS90ZW1wbGF0ZS97dElkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzc2lnbihjSWQsIHRJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICAgICAgdElkOiB0SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgdGVtcGxhdGUgZm9ybSBzeXN0ZW1cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUoY0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogYXNzaWduIGEgdGVtcGxhdGUgdG8gYSBzeXN0ZW1cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRJZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGFzc2lnbjogZnVuY3Rpb24gKGNJZCwgdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3NpZ24oY0lkLCB0SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDdXN0b21lcicsIFsnU2VhUmVxdWVzdCcsICdzZWFDdXN0b21lclNldHRpbmcnLCAnc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUnLCAnc2VhQ3VzdG9tZXJUYWcnLFxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyKFNlYVJlcXVlc3QsIHNlYUN1c3RvbWVyU2V0dGluZywgc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUsIHNlYUN1c3RvbWVyVGFnKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci97Y0lkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGN1c3RvbWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGN1c3RvbWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgY3VzdG9tZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY3VzdG9tZXJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY291bnRyeV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckludGVybl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckV4dGVybl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjb21wYW55TmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzdHJlZXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbemlwQ29kZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjaXR5XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGN1c3RvbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoY3VzdG9tZXIpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFDdXN0b21lclNldHRpbmcsXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hUaW1lOiBzZWFDdXN0b21lckRpc3BhdGNoVGltZSxcbiAgICAgICAgICAgICAgICB0YWc6IHNlYUN1c3RvbWVyVGFnXG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL2Rpc3BhdGNoVGltZS97ZHRJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGRpc3BhdGNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChkaXNwYXRjaFRpbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGR0SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBkdElkOiBkdElkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGRpc3BhdGNoVGltZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2RlZmVyXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGRpc3BhdGNoVGltZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkdElkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZGVmZXJdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZGlzcGF0Y2hUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoZGlzcGF0Y2hUaW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGR0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koZHRJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUN1c3RvbWVyU2V0dGluZycsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ3VzdG9tZXJTZXR0aW5nKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL3tjSWR9L3NldHRpbmcnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoY0lkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY0lkID0gY0lkO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgY3VzdG9tZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoY0lkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGNJZCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDdXN0b21lclRhZycsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFDdXN0b21lclRhZyhTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL3RhZy97dElkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh0YWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChkaXNwdGFnYXRjaFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KHRJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICB0SWQ6IHRJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhIHRhZ1xyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgdGFnXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt0SWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKHRhZyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICh0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveSh0SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUdyb3VwJywgWydTZWFSZXF1ZXN0JywgJ3NlYUdyb3VwU2V0dGluZycsICdzZWFHcm91cFVzZXInLFxuICAgIGZ1bmN0aW9uIHNlYUdyb3VwKFNlYVJlcXVlc3QsIHNlYUdyb3VwU2V0dGluZywgc2VhR3JvdXBVc2VyKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdncm91cC97Z0lkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGdyb3VwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBncm91cFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoZ0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGdyb3VwXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZ0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShncm91cCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChnSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koZ0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgc2V0dGluZzogc2VhR3JvdXBTZXR0aW5nLFxuICAgICAgICAgICAgICAgIHVzZXI6IHNlYUdyb3VwVXNlclxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUdyb3VwU2V0dGluZycsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhR3JvdXBTZXR0aW5nKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2dyb3VwL3tnSWR9L3NldHRpbmcnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZ0lkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuZ0lkID0gZ0lkO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChnSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgZ3JvdXBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZ0lkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGdJZCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFHcm91cFVzZXInLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUdyb3VwVXNlcihTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdncm91cC97Z0lkfS91c2VyL3t1SWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkVXNlcihnSWQsIHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkLFxuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmVVc2VyKGdJZCwgdUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChnSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBhZGQgdXNlciB0byBncm91cFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAoZ0lkLCB1SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFkZFVzZXIoZ0lkLCB1SWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiByZW1vdmUgdXNlciB0byBncm91cFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoZ0lkLCB1SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZVVzZXIoZ0lkLCB1SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZScsIFsnU2VhUmVxdWVzdCcsICdzZWFNZU1vYmlsZXB1c2gnLCAnc2VhTWVOb3RpZmljYXRpb24nLFxuICAgIGZ1bmN0aW9uIHNlYU1lKFNlYVJlcXVlc3QsIHNlYU1lTW9iaWxlcHVzaCwgc2VhTWVOb3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ21lL3thY3Rpb259Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9mb3JtYXROb2RlKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5kYXRlICYmIHR5cGVvZiAobm9kZS5kYXRlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRlID0gbmV3IERhdGUobm9kZS5kYXRlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sYXN0RGF0ZSAmJiB0eXBlb2YgKG5vZGUubGFzdERhdGUpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmxhc3REYXRlID0gbmV3IERhdGUobm9kZS5sYXN0RGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9mb3JtYXREYXRhKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gZGF0YS5pbmRleE9mKCdsb2FkZmluaXNoJyk7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgX2Zvcm1hdE5vZGUoZGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG1lKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjdXN0b21lcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdjdXN0b21lcidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZmVlZChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdmZWVkJztcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBrZXkobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2tleScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbm9kZXMocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnbm9kZXMnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihfZm9ybWF0RGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbWU6IG1lLFxuICAgICAgICAgICAgICAgIGN1c3RvbWVyOiBjdXN0b21lcixcbiAgICAgICAgICAgICAgICBmZWVkOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWVkKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBrZXk6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXkobmFtZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBub2RlczogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9iaWxlcHVzaDogc2VhTWVNb2JpbGVwdXNoLFxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhTWVOb3RpZmljYXRpb25cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZU1vYmlsZXB1c2gnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYU1lTW9iaWxlcHVzaChTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdtZS9tb2JpbGVwdXNoL3toYW5kbGV9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGlzdDogbGlzdCxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGFkZCBtb2JpbGVwdXNoXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gaGFuZGxlXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gdHlwZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZU5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhTWVOb3RpZmljYXRpb24oU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnbWUvbm90aWZpY2F0aW9uL3tuSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShuSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGxpc3QgYWxsIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7Qm9vbGVhbn0gIGluY2x1ZGVHcm91cHNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25JZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWQgfHwgYUlkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKG5JZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShuSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBcclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJywgW10pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuY29uZmlnKFsnc2VhQ29uZmlnUHJvdmlkZXInLCBmdW5jdGlvbiAoc2VhQXBpQ29uZmlnUHJvdmlkZXIpIHtcclxuICAgICAgICBcclxuICAgIH1dKTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnU2VhUmVxdWVzdCcsIFsnc2VhQ29uZmlnJywgJyRxJywgJyRodHRwJyxcclxuICAgIGZ1bmN0aW9uIFNlYVJlcXVlc3Qoc2VhQ29uZmlnLCAkcSwgJGh0dHApIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU2VhUmVxdWVzdCh1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVybFBhdGggPSB1cmxQYXRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVyZ2VzIHVybCBhbmQgcGFyYW1zIHRvIGEgdmFsaWQgYXBpIHVybCBwYXRoLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiA8cHJlPjxjb2RlPlxyXG4gICAgICAgICAgICAgKiB1cmwgPSAnL2FnZW50LzphSWQnXHJcbiAgICAgICAgICAgICAqIHBhcmFtcyA9IHsgYUlkOiAndGVzdC1hZ2VudC1pZCcsIG5hbWU6ICd0ZXN0IGFnZW50JyB9XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIHVybCA9IGZvcm1hdFVybCh1cmxQYXRoLCBwYXJhbXMpXHJcbiAgICAgICAgICAgICAqIHVybCA9PSAnL2FnZW50L3Rlc3QtYWdlbnQtaWQnXHJcbiAgICAgICAgICAgICAqIDwvcHJlPjwvY29kZT5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gdXJsICAgIHVybCB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXMgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5mb3JtYXRVcmwgPSBmdW5jdGlvbiBmb3JtYXRVcmwodXJsLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHBhcmFtcyksXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXFxceycgKyBrZXlzW2ldICsgJ1xcXFx9JywgJ2dtJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgcGFyYW1zW2tleXNbaV1dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXlzW2ldXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcL3tbYS16MC05XSp9JC9pLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIHNlbmQobWV0aG9kLCBwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmdWxsVXJsID0gc2VhQ29uZmlnLmdldFVybCh1cmxQYXRoIHx8IHRoaXMudXJsUGF0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmYgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBhbmd1bGFyLmNvcHkocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGNvbmYudXJsID0gdGhpcy5mb3JtYXRVcmwoZnVsbFVybCwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSAnUE9TVCcgfHwgbWV0aG9kID09PSAnUFVUJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmYuZGF0YSA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZi5wYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGh0dHAoY29uZikudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogcGVyZm9ybSBHRVQgcmVxdWVzdFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFBhdGggb25seSBhcHBlbmQgaWYgdXJsIGlzIGRpZmZlcmVudCB0byBjbGFzc2VzIHVybFBhdGhcclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0dFVCcsIHBhcmFtcywgdXJsUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBwZXJmb3JtIFBPU1QgcmVxdWVzdFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFBhdGggb25seSBhcHBlbmQgaWYgdXJsIGlzIGRpZmZlcmVudCB0byBjbGFzc2VzIHVybFBhdGhcclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiBnZXQocGFyYW1zLCB1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIHBlcmZvcm0gUFVUIHJlcXVlc3RcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICBwYXJhbXMgIFRoZSByZXF1ZXN0IHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICB1cmxQYXRoIG9ubHkgYXBwZW5kIGlmIHVybCBpcyBkaWZmZXJlbnQgdG8gY2xhc3NlcyB1cmxQYXRoXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBwcm9taXNlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiBnZXQocGFyYW1zLCB1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBwYXJhbXMsIHVybFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogcGVyZm9ybSBERUxFVEUgcmVxdWVzdFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFBhdGggb25seSBhcHBlbmQgaWYgdXJsIGlzIGRpZmZlcmVudCB0byBjbGFzc2VzIHVybFBhdGhcclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0RFTEVURScsIHBhcmFtcywgdXJsUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBTZWFSZXF1ZXN0O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYVVzZXJHcm91cCcsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhVXNlckdyb3VwKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0vZ3JvdXAve2dJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdCh1SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRVc2VyKHVJZCwgZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZVVzZXIodUlkLCBnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAodUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGFkZCB1c2VyIHRvIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uICh1SWQsIGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWRkVXNlcih1SWQsIGdJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHJlbW92ZSB1c2VyIHRvIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICh1SWQsIGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlVXNlcih1SWQsIGdJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYVVzZXJTZXR0aW5nJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFVc2VyU2V0dGluZyhTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCd1c2VyL3t1SWR9L3NldHRpbmcnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdCh1SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUodUlkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MudUlkID0gdUlkO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHVJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdCh1SWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgdXNlclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh1SWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUodUlkLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYVVzZXJTdWJzdGl0dWRlJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFVc2VyU3Vic3RpdHVkZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCd1c2VyL3t1SWR9L3N1YnN0aXR1ZGUve3N1YnN0aXR1ZGVJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0KHVJZCwgc3Vic3RJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkLFxuICAgICAgICAgICAgICAgICAgICBzdWJzdGl0dWRlSWQ6IHN1YnN0SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogc2V0IGEgc3Vic3RpdHVkZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodUlkLCBzdWJzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXQodUlkLCBzdWJzdElkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIHN1YnN0aXR1ZGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAodUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmUodUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlcicsIFsnU2VhUmVxdWVzdCcsICdzZWFVc2VyR3JvdXAnLCAnc2VhVXNlclNldHRpbmcnLCAnc2VhVXNlclN1YnN0aXR1ZGUnLFxuICAgIGZ1bmN0aW9uIHNlYVVzZXIoU2VhUmVxdWVzdCwgc2VhVXNlckdyb3VwLCBzZWFVc2VyU2V0dGluZywgc2VhVXNlclN1YnN0aXR1ZGUpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0KHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNlYXJjaChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgdXNlclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3ByZW5hbWVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3VybmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtyb2xlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGdJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSB1c2VyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVzZXJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3ByZW5hbWVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3VybmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtyb2xlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh1c2VyKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKHVJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveSh1SWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBzZWFyY2ggdXNlcnNcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3F1ZXJ5XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge0Jvb2xlYW59ICBbaW5jbHVkZUxvY2F0aW9uXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldHRpbmc6IHNlYVVzZXJTZXR0aW5nLFxuICAgICAgICAgICAgICAgIGdyb3VwOiBzZWFVc2VyR3JvdXAsXG4gICAgICAgICAgICAgICAgc3Vic3RpdHVkZTogc2VhVXNlclN1YnN0aXR1ZGVcbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiXX0=
