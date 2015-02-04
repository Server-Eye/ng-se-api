"use strict";

angular.module('ngSeApi').factory('sesMe', ['SesRequest', 'sesMeMobilepush', 'sesMeNotification',
  function sesMe(SesRequest, sesMeMobilepush, sesMeNotification) {
        var request = new SesRequest('me/{action}');

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

            mobilepush: sesMeMobilepush,
            notification: sesMeNotification
        };
}]);