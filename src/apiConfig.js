"use strict";

angular.module('ngSeApi').provider('sesApiConfig', ['$httpProvider', function SesApiConfigProvider($httpProvider) {
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
