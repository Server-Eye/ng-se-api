(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider',
        function SeaConfigProvider($httpProvider) {
            var config = {
                baseUrl: 'https://api.server-eye.de',
                patchUrl: 'https://patch.server-eye.de',
                pmUrl: 'https://pm.server-eye.de',
                microServiceUrl: 'https://api-ms.server-eye.de',
                socketUrl: 'https://api.server-eye.de',
                apiVersion: 2,
                microServiceApiVersion: 3,
                apiKey: null,
                getUrl: function (path) {
                    return [this.baseUrl, this.apiVersion, path].join('/');
                },
                addTraces: false
            };

            $httpProvider.interceptors.push(function () {
                return {
                    'request': function (reqConfig) {
                        if (reqConfig.url && reqConfig.url.includes(config.patchUrl)) { return reqConfig; }

                        reqConfig.headers['x-request-origin'] = "OCC";

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

            this.setPatchUrl = function (patchUrl) {
                config.patchUrl = patchUrl;
            }

            this.setPmUrl = function (pmUrl) {
                config.pmUrl = pmUrl;
            }

            this.setMicroServiceUrl = function (microServiceUrl) {
                config.microServiceUrl = microServiceUrl;
            }

            this.setSocketUrl = function (socketUrl) {
                config.socketUrl = socketUrl;
            }

            this.setApiVersion = function (apiVersion) {
                config.apiVersion = apiVersion;
            }

            this.setMicroServiceApiVersion = function (microServiceApiVersion) {
                config.microServiceApiVersion = microServiceApiVersion;
            }

            this.setApiKey = function (apiKey) {
                config.apiKey = apiKey;
            }

            this.setAddTraces = function (addTraces) {
                config.addTraces = addTraces;
            }

            this.$get = function ($http) {
                return {
                    getBaseUrl: function () {
                        return config.baseUrl;
                    },
                    getPatchUrl: function () {
                        return config.patchUrl;
                    },
                    getPmUrl: function () {
                        return config.pmUrl;
                    },
                    getMicroServiceUrl: function () {
                        return config.microServiceUrl;
                    },
                    getSocketUrl: function () {
                        return config.socketUrl;
                    },
                    getApiVersion: function () {
                        return config.apiVersion;
                    },
                    getMicroServiceApiVersion: function () {
                        return config.microServiceApiVersion;
                    },
                    getApiKey: function () {
                        return config.apiKey;
                    },
                    setApiKey: function (apiKey) {
                        config.apiKey = apiKey;
                    },
                    setAddTraces: function (addTraces) {
                        config.addTraces = addTraces;
                    },
                    getAddTraces: function () {
                        return config.addTraces;
                    },
                    getUrl: function (path) {
                        return [config.baseUrl, config.apiVersion, path].join('/');
                    }
                }
            };
        }]);

    angular.module('ngSeApi').config(['seaConfigProvider',
        function (seaApiConfigProvider) {

        }]);
})();