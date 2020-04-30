(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider',
        function SeaConfigProvider($httpProvider) {
            var config = {
                baseUrl: 'https://api.server-eye.de',
                patchUrl: 'https://patch.server-eye.de',
                pmUrl: 'https://pm.server-eye.de',
                vaultUrl: 'https://vault-api.server-eye.de',
                apiVersion: 2,
                vaultApiVersion: 1,
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

            this.setPatchUrl = function (patchUrl) {
                config.patchUrl = patchUrl;
            }

            this.setPmUrl = function (pmUrl) {
                config.pmUrl = pmUrl;
            }

            this.setVaultUrl = function (vaultUrl) {
                config.vaultUrl = vaultUrl;
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
                    getPatchUrl: function () {
                        return config.patchUrl;
                    },
                    getPmUrl: function () {
                        return config.pmUrl;
                    },
                    getVaultUrl: function () {
                        return config.vaultUrl;
                    },
                    getApiVersion: function () {
                        return config.apiVersion;
                    },
                    getVaultApiVersion: function () {
                        return config.vaultApiVersion;
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

    angular.module('ngSeApi').config(['seaConfigProvider',
        function (seaApiConfigProvider) {

        }]);
})();