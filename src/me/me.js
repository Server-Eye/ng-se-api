"use strict";

angular.module('ngSeApi').factory('sesMe', ['SesRequest', 'sesMeMobilepush', 'sesMeNotification',
  function sesMe(SesRequest, sesMeMobilepush, sesMeNotification) {
        var request = new SesRequest('me/{action}');

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

            return request.get(params);
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

            mobilepush: sesMeMobilepush,
            notification: sesMeNotification
        };
}]);
