(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMe', ['SeaRequest', 'seaMeLocation', 'seaMeMobilepush', 'seaMeNotification',
        function seaMe(SeaRequest, seaMeLocation, seaMeMobilepush, seaMeNotification) {
            var request = new SeaRequest('me/{action}');

            function _formatNode(node) {
                ['date', 'lastDate', 'silencedUntil'].forEach(function (key) {
                    if (node[key] && typeof (node[key]) === 'string') {
                        node[key] = new Date(node[key]);
                    }
                });

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

                location: seaMeLocation,
                mobilepush: seaMeMobilepush,
                notification: seaMeNotification
            };
        }]);
})();