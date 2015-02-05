/**
 * ng-se-api
 * @version 0.2.0
 * @link https://github.com/Server-Eye/ng-se-api.git
 * @license MIT
 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
            category : {
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

},{}],3:[function(require,module,exports){
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
            }).then(function(notes) {
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
                return request.post(params, 'agent/state').then(function(statesById) {
                    angular.forEach(Object.keys(statesById), function(key) {
                        angular.forEach(statesById[key], formatState);
                    });

                    return statesById;
                });
            }
            return request.get(params).then(function(states) {
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

},{}],7:[function(require,module,exports){
"use strict";

angular.module('ngSeApi').factory('seaAgentType', ['SeaRequest',
  function seaAgentType(SeaRequest) {
        var request = new SeaRequest('agent/type');

        function listSettings(akId) {
            return request.get({ akId : akId }, 'agent/type/{akId}/setting');
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
                connect: function(cId, params) {
                    return connectPcvisit(cId, params);
                }
            }
        };
}]);

},{}],12:[function(require,module,exports){
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
            }).then(function(notes) {
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";

angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerSetting', 'seaCustomerDispatchTime',
  function seaCustomer(SeaRequest, seaCustomerSetting, seaCustomerDispatchTime) {
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
            dispatchTime: seaCustomerDispatchTime
        };
}]);

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
            create: function(params) {
                return create(params);
            },

            get: function(handle) {
                return get(handle);
            },

            destroy: function(handle) {
                return destroy(handle);
            }
        };
}]);

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
"use strict";

(function () {
    angular.module('ngSeApi', []);

    angular.module('ngSeApi').config(['seaConfigProvider', function (seaApiConfigProvider) {
        
    }]);
})();

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
            search: function(params) {
                return search(params);
            },

            setting: seaUserSetting,
            group: seaUserGroup,
            substitude: seaUserSubstitude
        };
}]);

},{}]},{},[26,9,27,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,19,18,23,24,25,20,21,22,31,29,28,30])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4uXFxhZ2VudFxcYWdlbnQuanMiLCIuLlxcYWdlbnRcXG1pc2MuanMiLCIuLlxcYWdlbnRcXG5vdGUuanMiLCIuLlxcYWdlbnRcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxhZ2VudFxcc2V0dGluZy5qcyIsIi4uXFxhZ2VudFxcc3RhdGUuanMiLCIuLlxcYWdlbnRcXHR5cGUuanMiLCIuLlxcYXV0aFxcYXV0aC5qcyIsIi4uXFxjb25maWcuanMiLCIuLlxcY29udGFpbmVyXFxjb250YWluZXIuanMiLCIuLlxcY29udGFpbmVyXFxtaXNjLmpzIiwiLi5cXGNvbnRhaW5lclxcbm90ZS5qcyIsIi4uXFxjb250YWluZXJcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxjb250YWluZXJcXHByb3Bvc2FsLmpzIiwiLi5cXGNvbnRhaW5lclxcc3RhdGUuanMiLCIuLlxcY29udGFpbmVyXFx0ZW1wbGF0ZS5qcyIsIi4uXFxjdXN0b21lclxcY3VzdG9tZXIuanMiLCIuLlxcY3VzdG9tZXJcXGRpc3BhdGNoVGltZS5qcyIsIi4uXFxjdXN0b21lclxcc2V0dGluZy5qcyIsIi4uXFxncm91cFxcZ3JvdXAuanMiLCIuLlxcZ3JvdXBcXHNldHRpbmcuanMiLCIuLlxcZ3JvdXBcXHVzZXIuanMiLCIuLlxcbWVcXG1lLmpzIiwiLi5cXG1lXFxtb2JpbGVwdXNoLmpzIiwiLi5cXG1lXFxub3RpZmljYXRpb24uanMiLCIuLlxcbW9kdWxlLmpzIiwiLi5cXHJlcXVlc3QuanMiLCIuLlxcdXNlclxcZ3JvdXAuanMiLCIuLlxcdXNlclxcc2V0dGluZy5qcyIsIi4uXFx1c2VyXFxzdWJzdGl0dWRlLmpzIiwiLi5cXHVzZXJcXHVzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudCcsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFBZ2VudE5vdGUnLCAnc2VhQWdlbnROb3RpZmljYXRpb24nLCAnc2VhQWdlbnRNaXNjJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFBZ2VudFNldHRpbmcnLCAnc2VhQWdlbnRTdGF0ZScsICdzZWFBZ2VudFR5cGUnLFxyXG4gIGZ1bmN0aW9uIHNlYUFnZW50KFNlYVJlcXVlc3QsIHNlYUFnZW50Tm90ZSwgc2VhQWdlbnROb3RpZmljYXRpb24sIHNlYUFnZW50TWlzYywgc2VhQWdlbnRTZXR0aW5nLCBzZWFBZ2VudFN0YXRlLCBzZWFBZ2VudFR5cGUpIHtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfScpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldChhSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgIGFJZDogYUlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGFnZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChhZ2VudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGFJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgYUlkOiBhSWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogY3JlYXRlIGFnZW50XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFyZW50SWRdXHJcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3R5cGVdXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29weTogc2VhQWdlbnRNaXNjLmNvcHksXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXQoYUlkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiB1cGRhdGUgYWdlbnRcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGFnZW50XHJcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cclxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbaW50ZXJ2YWxdXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChhZ2VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShhZ2VudCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShhSWQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbm90ZTogc2VhQWdlbnROb3RlLFxyXG4gICAgICAgICAgICBhY3Rpb25sb2c6IHNlYUFnZW50TWlzYy5hY3Rpb25sb2csXHJcbiAgICAgICAgICAgIGNoYXJ0OiBzZWFBZ2VudE1pc2MuY2hhcnQsXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhQWdlbnROb3RpZmljYXRpb24sXHJcbiAgICAgICAgICAgIHNldHRpbmc6IHNlYUFnZW50U2V0dGluZyxcclxuICAgICAgICAgICAgc3RhdGU6IHNlYUFnZW50U3RhdGUsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBzZWFBZ2VudE1pc2MuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHR5cGU6IHNlYUFnZW50VHlwZVxyXG4gICAgICAgIH07XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50TWlzYycsIFsnU2VhUmVxdWVzdCcsXHJcbiAgZnVuY3Rpb24gc2VhQWdlbnRNaXNjKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS97YWN0aW9ufScpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaXN0QWN0aW9ubG9nKGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdhY3Rpb25sb2cnO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldENoYXJ0KGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdjaGFydCc7XHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29weShhSWQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcclxuICAgICAgICAgICAgcGFyYW1zLnBhcmVudElkID0gcGFyZW50SWQ7XHJcbiAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnY29weSc7XHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpc3RDYXRlZ29yaWVzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe30sICdhZ2VudC9jYXRlZ29yeScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9ubG9nOiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGxpc3QgYWN0aW9uIGxvZyBlbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBhSWQgICAgYWdlbnQgaWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gc3RhcnRcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IGxpbWl0XHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0QWN0aW9ubG9nKGFJZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogZ2V0IGNoYXJ0IGNvbmZpZyBhbmQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBhSWQgICAgYWdlbnQgaWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gc3RhcnRcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IGxpbWl0XHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSB2YWx1ZVR5cGVcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhcnQoYUlkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYXRlZ29yeSA6IHtcclxuICAgICAgICAgICAgICAgIGxpc3Q6IGxpc3RDYXRlZ29yaWVzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBjb3B5IGFnZW50IHRvIGEgcGFyZW50XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IGFJZFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIHBhcmVudElkXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvcHk6IGZ1bmN0aW9uIChhSWQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29weShhSWQsIHBhcmVudElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50Tm90ZScsIFsnU2VhUmVxdWVzdCcsXHJcbiAgZnVuY3Rpb24gc2VhQWdlbnROb3RlKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9ub3RlL3tuSWR9Jyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdE5vdGUobm90ZSkge1xyXG4gICAgICAgICAgICBub3RlLnBvc3RlZE9uID0gbmV3IERhdGUobm90ZS5wb3N0ZWRPbik7XHJcbiAgICAgICAgICAgIHJldHVybiBub3RlO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcykudGhlbihmb3JtYXROb3RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICBhSWQ6IGFJZFxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZvcm1hdE5vdGUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShhSWQsIG5JZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgYUlkOiBhSWQsXHJcbiAgICAgICAgICAgICAgICBuSWQ6IG5JZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBjcmVhdGUgYWdlbnQgbm90ZVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cclxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbWVzc2FnZV1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChhSWQsIG5JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koYUlkLCBuSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxufV0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudE5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYUFnZW50Tml0aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vbm90aWZpY2F0aW9uL3tuSWR9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsaXN0KGFJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICBhSWQ6IGFJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGFJZCwgbklkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgIGFJZDogYUlkLFxuICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3VzZXJJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogdXBkYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoYUlkLCBuSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShhSWQsIG5JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudFNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFBZ2VudFNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9zZXR0aW5nL3trZXl9Jyk7XG4gICAgICBcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHNldHRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgYUlkOiBhSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogY3JlYXRlIGFnZW50IG5vdGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2tleV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3ZhbHVlXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShzZXR0aW5nKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChhSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRTdGF0ZScsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYUFnZW50U3RhdGUoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9zdGF0ZScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdFN0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICBzdGF0ZS5kYXRlID0gbmV3IERhdGUoc3RhdGUuZGF0ZSk7XG4gICAgICAgICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmxhc3REYXRlKTtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpbnQoc2V0dGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcblxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuYUlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zLCAnYWdlbnQvc3RhdGUnKS50aGVuKGZ1bmN0aW9uKHN0YXRlc0J5SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKE9iamVjdC5rZXlzKHN0YXRlc0J5SWQpLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXNCeUlkW2tleV0sIGZvcm1hdFN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlc0J5SWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKS50aGVuKGZ1bmN0aW9uKHN0YXRlcykge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXMsIGZvcm1hdFN0YXRlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudCBzdGF0ZSBoaW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthdXRob3JdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtoaW50VHlwZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthc3NpZ25lZFVzZXJdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtBcnJheX0gW21lbnRpb25lZFVzZXJzXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3ByaXZhdGVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt1bnRpbF1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaGludDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBoaW50KHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGxpc3QgYWdlbnQgc3RhdGVzXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGFJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9XG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtsaW1pdF1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3N0YXJ0XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZW5kXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVIaW50c11cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlUmF3RGF0YV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Zvcm1hdF1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRUeXBlJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhQWdlbnRUeXBlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQvdHlwZScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpc3RTZXR0aW5ncyhha0lkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoeyBha0lkIDogYWtJZCB9LCAnYWdlbnQvdHlwZS97YWtJZH0vc2V0dGluZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNldHRpbmc6IHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBsaXN0IHNldHRpbmdzIG9mIGFuIGFnZW50IHR5cGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYWtJZF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYWtJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFNldHRpbmdzKGFrSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUF1dGgnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFBdXRoKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYXV0aC97YWN0aW9ufScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFwaUtleShwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAna2V5JztcblxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9naW4ocGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2xvZ2luJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KHBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdsb2dvdXQnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSBhcGlLZXlcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFzc3dvcmRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt0eXBlXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbdmFsaWRVbnRpbF1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW21heFVzZXNdXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNyZWF0ZUFwaUtleTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVBcGlLZXkocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogbG9naW5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FwaUtleV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFzc3dvcmRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbY3JlYXRlQXBpS2V5XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXBpS2V5TmFtZV1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9naW4ocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxvZ291dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2dvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5wcm92aWRlcignc2VhQ29uZmlnJywgWyckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24gU2VhQ29uZmlnUHJvdmlkZXIoJGh0dHBQcm92aWRlcikge1xyXG4gICAgdmFyIGNvbmZpZyA9IHtcclxuICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuc2VydmVyLWV5ZS5kZScsXHJcbiAgICAgICAgYXBpVmVyc2lvbjogMixcclxuICAgICAgICBhcGlLZXk6IG51bGwsXHJcbiAgICAgICAgZ2V0VXJsOiBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuYmFzZVVybCwgdGhpcy5hcGlWZXJzaW9uLCBwYXRoXS5qb2luKCcvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAncmVxdWVzdCc6IGZ1bmN0aW9uIChyZXFDb25maWcpIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmFwaUtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcUNvbmZpZy5oZWFkZXJzWyd4LWFwaS1rZXknXSA9IGNvbmZpZy5hcGlLZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcUNvbmZpZztcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICdyZXNwb25zZSc6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc2V0QmFzZVVybCA9IGZ1bmN0aW9uIChiYXNlVXJsKSB7XHJcbiAgICAgICAgY29uZmlnLmJhc2VVcmwgPSBiYXNlVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0QXBpVmVyc2lvbiA9IGZ1bmN0aW9uIChhcGlWZXJzaW9uKSB7XHJcbiAgICAgICAgY29uZmlnLmFwaVZlcnNpb24gPSBhcGlWZXJzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0QXBpS2V5ID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgICAgIGNvbmZpZy5hcGlLZXkgPSBhcGlLZXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCRodHRwKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0QmFzZVVybDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5iYXNlVXJsO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRBcGlWZXJzaW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLmFwaVZlcnNpb247XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEFwaUtleTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5hcGlLZXk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldEFwaUtleTogZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLmFwaUtleSA9IGFwaUtleTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0VXJsOiBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjb25maWcuYmFzZVVybCwgY29uZmlnLmFwaVZlcnNpb24sIHBhdGhdLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyJywgWydTZWFSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFDb250YWluZXJNaXNjJywgJ3NlYUNvbnRhaW5lck5vdGUnLCAnc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFDb250YWluZXJQcm9wb3NhbCcsICdzZWFDb250YWluZXJTdGF0ZScsICdzZWFDb250YWluZXJUZW1wbGF0ZScsXG4gIGZ1bmN0aW9uIHNlYUNvbnRhaW5lcihTZWFSZXF1ZXN0LCBzZWFDb250YWluZXJNaXNjLCBzZWFDb250YWluZXJOb3RlLCBzZWFDb250YWluZXJOb3RpZmljYXRpb24sIHNlYUNvbnRhaW5lclByb3Bvc2FsLCBzZWFDb250YWluZXJTdGF0ZSwgc2VhQ29udGFpbmVyVGVtcGxhdGUpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGNJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoY29udGFpbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGNJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHVwZGF0ZSBjb250YWluZXJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250YWluZXJcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbYWxlcnRPZmZsaW5lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2FsZXJ0U2h1dGRvd25dXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFttYXhIZWFydGJlYXRUaW1lb3V0XVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koY0lkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGFjdGlvbmxvZzogc2VhQ29udGFpbmVyTWlzYy5hY3Rpb25sb2csXG4gICAgICAgICAgICBpbnZlbnRvcnk6IHNlYUNvbnRhaW5lck1pc2MuaW52ZW50b3J5LFxuICAgICAgICAgICAgbm90ZTogc2VhQ29udGFpbmVyTm90ZSxcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uLFxuICAgICAgICAgICAgcGN2aXNpdDogc2VhQ29udGFpbmVyTWlzYy5wY3Zpc2l0LFxuICAgICAgICAgICAgcHJvcG9zYWw6IHNlYUNvbnRhaW5lclByb3Bvc2FsLFxuICAgICAgICAgICAgc3RhdGU6IHNlYUNvbnRhaW5lclN0YXRlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHNlYUNvbnRhaW5lclRlbXBsYXRlXG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJNaXNjJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhQ29udGFpbmVyTWlzYyhTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS97YWN0aW9ufScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpc3RBY3Rpb25sb2coY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XG4gICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2FjdGlvbmxvZyc7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEludmVudG9yeShjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgcGFyYW1zLmNJZCA9IGNJZDtcbiAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnaW52ZW50b3J5JztcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29ubmVjdFBjdmlzaXQoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XG4gICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ3BjdmlzaXQnO1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWN0aW9ubG9nOiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogbGlzdCBhY3Rpb24gbG9nIGVudHJpZXNcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBjSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBbc3RhcnRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gW2xpbWl0XVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RBY3Rpb25sb2coY0lkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGludmVudG9yeToge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGdldCBpbnZlbnRvcnkgb2YgdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgY0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtmb3JtYXRdXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRJbnZlbnRvcnkoY0lkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwY3Zpc2l0OiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogaW5zdGFsbCBhbmQgY29ubmVjdCB0byBwY3Zpc2l0XG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gICBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtzdXBwb3J0ZXJJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtzdXBwb3J0ZXJQYXNzd29yZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFt1c2VyXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3Bhc3N3b3JkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW2RvbWFpbl1cbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24oY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3RQY3Zpc2l0KGNJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJOb3RlJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhQ29udGFpbmVyTm90ZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9ub3RlL3tuSWR9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0Tm90ZShub3RlKSB7XG4gICAgICAgICAgICBub3RlLnBvc3RlZE9uID0gbmV3IERhdGUobm90ZS5wb3N0ZWRPbik7XG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKS50aGVuKGZvcm1hdE5vdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obm90ZXMpIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZvcm1hdE5vdGUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGNJZCwgbklkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgIGFJZDogY0lkLFxuICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSBub3RlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFttZXNzYWdlXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChjSWQsIG5JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGNJZCwgbklkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lck5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYUNvbnRhaW5lck5vdGlmaWNhdGlvbihTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9ub3RpZmljYXRpb24ve25JZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkLCBuSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgbklkOiBuSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogY3JlYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY0lkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiB1cGRhdGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt1c2VySWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChjSWQsIG5JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGNJZCwgbklkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lclByb3Bvc2FsJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhQ29udGFpbmVyUHJvcG9zYWwoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vcHJvcG9zYWwve3BJZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBhY2NlcHQoY0lkLCBwSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgcElkOiBwSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVueShjSWQsIHBJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICBwSWQ6IHBJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsaXN0U2V0dGluZ3MoY0lkLCBwSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgcElkOiBwSWRcbiAgICAgICAgICAgIH0sICdjb250YWluZXIve2NJZH0vcHJvcG9zYWwve3BJZH0vc2V0dGluZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjY2VwdDogZnVuY3Rpb24gKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdChjSWQsIHBJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlbnk6IGZ1bmN0aW9uIChjSWQsIHBJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZW55KGNJZCwgcElkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0U2V0dGluZ3MoY0lkLCBwSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lclN0YXRlJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhQ29udGFpbmVyU3RhdGUoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vc3RhdGUnKTtcblxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICAgICAgc3RhdGUuZGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmRhdGUpO1xuICAgICAgICAgICAgc3RhdGUubGFzdERhdGUgPSBuZXcgRGF0ZShzdGF0ZS5sYXN0RGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaW50KHNldHRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XG5cbiAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuY0lkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zLCAnY29udGFpbmVyL3N0YXRlJykudGhlbihmdW5jdGlvbihzdGF0ZXNCeUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChPYmplY3Qua2V5cyhzdGF0ZXNCeUlkKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc3RhdGVzQnlJZFtrZXldLCBmb3JtYXRTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihmdW5jdGlvbihzdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc3RhdGVzLCBmb3JtYXRTdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBjcmVhdGUgY29udGFpbmVyIHN0YXRlIGhpbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3NJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2F1dGhvcl1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2hpbnRUeXBlXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbWVzc2FnZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Fzc2lnbmVkVXNlcl1cbiAgICAgICAgICAgICAqIEBjb25maWcge0FycmF5fSBbbWVudGlvbmVkVXNlcnNdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcHJpdmF0ZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3VudGlsXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBoaW50OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhpbnQocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogbGlzdCBjb250YWluZXIgc3RhdGVzXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGNJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9XG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtsaW1pdF1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3N0YXJ0XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZW5kXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVIaW50c11cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlUmF3RGF0YV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Zvcm1hdF1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyVGVtcGxhdGUnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFDb250YWluZXJUZW1wbGF0ZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS90ZW1wbGF0ZS97dElkfScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShjSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFzc2lnbihjSWQsIHRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgdElkOiB0SWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogY3JlYXRlIHRlbXBsYXRlIGZvcm0gc3lzdGVtXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUoY0lkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogYXNzaWduIGEgdGVtcGxhdGUgdG8gYSBzeXN0ZW1cbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjSWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0SWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXNzaWduOiBmdW5jdGlvbiAoY0lkLCB0SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNzaWduKGNJZCwgdElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUN1c3RvbWVyJywgWydTZWFSZXF1ZXN0JywgJ3NlYUN1c3RvbWVyU2V0dGluZycsICdzZWFDdXN0b21lckRpc3BhdGNoVGltZScsXG4gIGZ1bmN0aW9uIHNlYUN1c3RvbWVyKFNlYVJlcXVlc3QsIHNlYUN1c3RvbWVyU2V0dGluZywgc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY3VzdG9tZXIve2NJZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBnZXQoY0lkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgIGNJZDogY0lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShjdXN0b21lcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGN1c3RvbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGNJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHVwZGF0ZSBjdXN0b21lclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGN1c3RvbWVyXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjb3VudHJ5XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbY3VzdG9tZXJOdW1iZXJJbnRlcm5dXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckV4dGVybl1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NvbXBhbnlOYW1lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3RyZWV0XVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbemlwQ29kZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NpdHldXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChjdXN0b21lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoY3VzdG9tZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0dGluZzogc2VhQ3VzdG9tZXJTZXR0aW5nLFxuICAgICAgICAgICAgZGlzcGF0Y2hUaW1lOiBzZWFDdXN0b21lckRpc3BhdGNoVGltZVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFDdXN0b21lckRpc3BhdGNoVGltZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL2Rpc3BhdGNoVGltZS97ZHRJZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsaXN0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZGlzcGF0Y2hUaW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoZGlzcGF0Y2hUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koZHRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICBkdElkOiBkdElkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSBkaXNwYXRjaFRpbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtkZWZlcl1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHVwZGF0ZSBkaXNwYXRjaFRpbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2R0SWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZGVmZXJdXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRpc3BhdGNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoZGlzcGF0Y2hUaW1lKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChkdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koZHRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDdXN0b21lclNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFDdXN0b21lclNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci97Y0lkfS9zZXR0aW5nJyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGNJZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XG4gICAgICAgICAgICBzZXR0aW5ncy5jSWQgPSBjSWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiB1cGRhdGUgY3VzdG9tZXJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjSWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChjSWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShjSWQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUdyb3VwJywgWydTZWFSZXF1ZXN0JywgJ3NlYUdyb3VwU2V0dGluZycsICdzZWFHcm91cFVzZXInLFxuICBmdW5jdGlvbiBzZWFHcm91cChTZWFSZXF1ZXN0LCBzZWFHcm91cFNldHRpbmcsIHNlYUdyb3VwVXNlcikge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdncm91cC97Z0lkfScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldChnSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGdyb3VwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoZ3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShnSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogY3JlYXRlIGdyb3VwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldChnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiB1cGRhdGUgZ3JvdXBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBncm91cFxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZ0lkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZ3JvdXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGdyb3VwKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0dGluZzogc2VhR3JvdXBTZXR0aW5nLFxuICAgICAgICAgICAgdXNlcjogc2VhR3JvdXBVc2VyXG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFHcm91cFNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFHcm91cFNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdncm91cC97Z0lkfS9zZXR0aW5nJyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChnSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGdJZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XG4gICAgICAgICAgICBzZXR0aW5ncy5nSWQgPSBnSWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiB1cGRhdGUgZ3JvdXBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChnSWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShnSWQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUdyb3VwVXNlcicsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYUdyb3VwVXNlcihTZWFSZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2dyb3VwL3tnSWR9L3VzZXIve3VJZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBsaXN0KGdJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRVc2VyKGdJZCwgdUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoe1xuICAgICAgICAgICAgICAgIHVJZDogdUlkLFxuICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVVzZXIoZ0lkLCB1SWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhZGQgdXNlciB0byBncm91cFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uIChnSWQsIHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhZGRVc2VyKGdJZCwgdUlkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogcmVtb3ZlIHVzZXIgdG8gZ3JvdXBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoZ0lkLCB1SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlVXNlcihnSWQsIHVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZScsIFsnU2VhUmVxdWVzdCcsICdzZWFNZU1vYmlsZXB1c2gnLCAnc2VhTWVOb3RpZmljYXRpb24nLFxuICBmdW5jdGlvbiBzZWFNZShTZWFSZXF1ZXN0LCBzZWFNZU1vYmlsZXB1c2gsIHNlYU1lTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ21lL3thY3Rpb259Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdE5vZGUobm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0ZSAmJiB0eXBlb2YgKG5vZGUuZGF0ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5kYXRlID0gbmV3IERhdGUobm9kZS5kYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdERhdGUgJiYgdHlwZW9mIChub2RlLmxhc3REYXRlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBub2RlLmxhc3REYXRlID0gbmV3IERhdGUobm9kZS5sYXN0RGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdERhdGEoZGF0YSkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IGRhdGEuaW5kZXhPZignbG9hZGZpbmlzaCcpO1xuICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBfZm9ybWF0Tm9kZShkYXRhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtZSgpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ2N1c3RvbWVyJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmZWVkKHBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdmZWVkJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBrZXkobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdrZXknLFxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbm9kZXMocGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ25vZGVzJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihfZm9ybWF0RGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbWU6IG1lLFxuICAgICAgICAgICAgY3VzdG9tZXI6IGN1c3RvbWVyLFxuICAgICAgICAgICAgZmVlZDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmZWVkKHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAga2V5OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkobmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9kZXM6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG1vYmlsZXB1c2g6IHNlYU1lTW9iaWxlcHVzaCxcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhTWVOb3RpZmljYXRpb25cbiAgICAgICAgfTtcbn1dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZU1vYmlsZXB1c2gnLCBbJ1NlYVJlcXVlc3QnLFxuICBmdW5jdGlvbiBzZWFNZU1vYmlsZXB1c2goU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdtZS9tb2JpbGVwdXNoL3toYW5kbGV9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGlzdDogbGlzdCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhZGQgbW9iaWxlcHVzaFxuICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSBoYW5kbGVcbiAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9IHR5cGVcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXQoaGFuZGxlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGhhbmRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZU5vdGlmaWNhdGlvbicsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYU1lTm90aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnbWUvbm90aWZpY2F0aW9uL3tuSWR9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGlzdChwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KG5JZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICBuSWQ6IG5JZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBsaXN0IGFsbCBub3RpZmljYXRpb25zXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAqIEBjb25maWcgIHtCb29sZWFufSAgaW5jbHVkZUdyb3Vwc1xuICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogdXBkYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY0lkIHx8IGFJZF1cbiAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChuSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShuSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5jb25maWcoWydzZWFDb25maWdQcm92aWRlcicsIGZ1bmN0aW9uIChzZWFBcGlDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgIFxyXG4gICAgfV0pO1xyXG59KSgpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnU2VhUmVxdWVzdCcsIFsnc2VhQ29uZmlnJywgJyRxJywgJyRodHRwJyxcclxuICBmdW5jdGlvbiBTZWFSZXF1ZXN0KHNlYUNvbmZpZywgJHEsICRodHRwKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gU2VhUmVxdWVzdCh1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXJsUGF0aCA9IHVybFBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNZXJnZXMgdXJsIGFuZCBwYXJhbXMgdG8gYSB2YWxpZCBhcGkgdXJsIHBhdGguXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiA8cHJlPjxjb2RlPlxyXG4gICAgICAgICAqIHVybCA9ICcvYWdlbnQvOmFJZCdcclxuICAgICAgICAgKiBwYXJhbXMgPSB7IGFJZDogJ3Rlc3QtYWdlbnQtaWQnLCBuYW1lOiAndGVzdCBhZ2VudCcgfVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogdXJsID0gZm9ybWF0VXJsKHVybFBhdGgsIHBhcmFtcylcclxuICAgICAgICAgKiB1cmwgPT0gJy9hZ2VudC90ZXN0LWFnZW50LWlkJ1xyXG4gICAgICAgICAqIDwvcHJlPjwvY29kZT5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IHVybCAgICB1cmwgdGVtcGxhdGVcclxuICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXMgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5mb3JtYXRVcmwgPSBmdW5jdGlvbiBmb3JtYXRVcmwodXJsLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpLFxyXG4gICAgICAgICAgICAgICAgaSA9IGtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXHsnICsga2V5c1tpXSArICdcXFxcfScsICdnbScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBwYXJhbXNba2V5c1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwYXJhbXNba2V5c1tpXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXC97W2EtejAtOV0qfSQvaSwgJycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiBzZW5kKG1ldGhvZCwgcGFyYW1zLCB1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBmdWxsVXJsID0gc2VhQ29uZmlnLmdldFVybCh1cmxQYXRoIHx8IHRoaXMudXJsUGF0aCksXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBjb25mID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcGFyYW1zID0gYW5ndWxhci5jb3B5KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbmYudXJsID0gdGhpcy5mb3JtYXRVcmwoZnVsbFVybCwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdQT1NUJyB8fCBtZXRob2QgPT09ICdQVVQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25mLmRhdGEgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25mLnBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGh0dHAoY29uZikudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBlcmZvcm0gR0VUIHJlcXVlc3RcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBwcm9taXNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdHRVQnLCBwYXJhbXMsIHVybFBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwZXJmb3JtIFBPU1QgcmVxdWVzdFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICB1cmxQYXRoIG9ubHkgYXBwZW5kIGlmIHVybCBpcyBkaWZmZXJlbnQgdG8gY2xhc3NlcyB1cmxQYXRoXHJcbiAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGVyZm9ybSBQVVQgcmVxdWVzdFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICB1cmxQYXRoIG9ubHkgYXBwZW5kIGlmIHVybCBpcyBkaWZmZXJlbnQgdG8gY2xhc3NlcyB1cmxQYXRoXHJcbiAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiBnZXQocGFyYW1zLCB1cmxQYXRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIHBhcmFtcywgdXJsUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBlcmZvcm0gREVMRVRFIHJlcXVlc3RcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBwcm9taXNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBwYXJhbXMsIHVybFBhdGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFNlYVJlcXVlc3Q7XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlckdyb3VwJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhVXNlckdyb3VwKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgndXNlci97dUlkfS9ncm91cC97Z0lkfScpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpc3QodUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZFVzZXIodUlkLCBnSWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh7XG4gICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVXNlcih1SWQsIGdJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcbiAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGFkZCB1c2VyIHRvIGdyb3VwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ0lkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKHVJZCwgZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkZFVzZXIodUlkLCBnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiByZW1vdmUgdXNlciB0byBncm91cFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICh1SWQsIGdJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVVc2VyKHVJZCwgZ0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYVVzZXJTZXR0aW5nJywgWydTZWFSZXF1ZXN0JyxcbiAgZnVuY3Rpb24gc2VhVXNlclNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCd1c2VyL3t1SWR9L3NldHRpbmcnKTtcblxuICAgICAgICBmdW5jdGlvbiBsaXN0KHVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICB1SWQ6IHVJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUodUlkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgICAgIHNldHRpbmdzLnVJZCA9IHVJZDtcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChzZXR0aW5ncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHVwZGF0ZSB1c2VyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAodUlkLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUodUlkLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFVc2VyU3Vic3RpdHVkZScsIFsnU2VhUmVxdWVzdCcsXG4gIGZ1bmN0aW9uIHNlYVVzZXJTdWJzdGl0dWRlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgndXNlci97dUlkfS9zdWJzdGl0dWRlL3tzdWJzdGl0dWRlSWR9Jyk7XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0KHVJZCwgc3Vic3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcbiAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcbiAgICAgICAgICAgICAgICBzdWJzdGl0dWRlSWQ6IHN1YnN0SWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICB1SWQ6IHVJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBzZXQgYSBzdWJzdGl0dWRlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ0lkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdUlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHVJZCwgc3Vic3RJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXQodUlkLCBzdWJzdElkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogcmVtb3ZlIHN1YnN0aXR1ZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAodUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZSh1SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xufV0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlcicsIFsnU2VhUmVxdWVzdCcsICdzZWFVc2VyR3JvdXAnLCAnc2VhVXNlclNldHRpbmcnLCAnc2VhVXNlclN1YnN0aXR1ZGUnLFxuICBmdW5jdGlvbiBzZWFVc2VyKFNlYVJlcXVlc3QsIHNlYVVzZXJHcm91cCwgc2VhVXNlclNldHRpbmcsIHNlYVVzZXJTdWJzdGl0dWRlKSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0nKTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXQodUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQodXNlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KHVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICB1SWQ6IHVJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWFyY2gocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNyZWF0ZSB1c2VyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcHJlbmFtZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3N1cm5hbWVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3JvbGVdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwaG9uZV1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldChnSWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiB1cGRhdGUgdXNlclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVzZXJcbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwcmVuYW1lXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3VybmFtZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbcm9sZV1cbiAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh1c2VyKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICh1SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveSh1SWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBzZWFyY2ggdXNlcnNcbiAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgcGFyYW1zXG4gICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtxdWVyeV1cbiAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgKiBAY29uZmlnICB7Qm9vbGVhbn0gIFtpbmNsdWRlTG9jYXRpb25dXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlYXJjaChwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0dGluZzogc2VhVXNlclNldHRpbmcsXG4gICAgICAgICAgICBncm91cDogc2VhVXNlckdyb3VwLFxuICAgICAgICAgICAgc3Vic3RpdHVkZTogc2VhVXNlclN1YnN0aXR1ZGVcbiAgICAgICAgfTtcbn1dKTtcbiJdfQ==
