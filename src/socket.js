(function () {
    "use strict";

    var VALID_EVENTS = ['USER_UPDATE', 'NODE_ADD', 'NODE_UPDATE', 'NODE_REMOVE', 'REMOTE_RESULT'];

    angular.module('ngSeApi').factory('seaSocket', ['$rootScope', 'seaConfig',
    function ($rootScope, seaConfig) {
            var connected = false,
                reconnected = false,
                hasEverBeenConnected = false,
                sio;

            var settings = {};

            function fireEvent(name, argsObj) {
                argsObj = argsObj || {};
                console.log('fireEvent', 'se_socket_' + name, argsObj);
                $rootScope.$broadcast('se_socket_' + name, argsObj);
            }

            function connect(credentials, rooms) {
                if (typeof io == 'undefined') {
                    console.error('required socket.io lib not found');
                    return;
                }

                sio = io(seaConfig.getBaseUrl());

                settings.rooms = rooms;

                sio.on('error', onerror);
                sio.on('connect', onconnect);
                sio.on('connecting', function () {
                    console.log('connecting socket');
                });
                sio.on('disconnect', function () {
                    console.log('disconnected socket');
                    onerror('socket.disconnected');
                });
                sio.on('connect_error', function () {
                    console.log('connect socket failed');
                    onerror('socket.connect_failed');
                });
                sio.on('reconnect_error', function () {
                    console.log('reconnect socket failed');
                    onerror('socket.reconnect_failed');
                });
                sio.on('reconnecting', function () {
                    console.log('reconnecting socket');
                });

                sio.on('socket:joined', function (userId, roomId) {
                    console.log(userId, 'joined', roomId);
                });

                // server-eye events
                VALID_EVENTS.forEach(function (evtName) {
                    sio.on(evtName, function (data) {
                        ondata(evtName, data);
                    });
                });
            }

            function sendSettings() {
                sio.emit('settings', settings);
            }

            function onerror(err) {
                console.log('socket error:', err);
                connected = false;
                fireEvent('error', err);
            }

            function onconnect() {
                console.log('connected socket');
                connected = true;

                if (hasEverBeenConnected) {
                    reconnected = true;
                }

                hasEverBeenConnected = true;

                var evt = reconnected ? 'reconnected' : 'connected';

                console.log('firing socket', evt);

                sendSettings();

                fireEvent(evt);
            }

            function ondata(type, data) {
                if(data && data.targetNode) {
                    if(data.targetNode.date) {
                        data.targetNode.date = new Date(data.targetNode.date);
                    }
                    
                    if(data.targetNode.lastDate) {
                        data.targetNode.lastDate = new Date(data.targetNode.lastDate);
                    }
                }
                
                fireEvent(type.toLowerCase(), data);
            }

            return {
                connect: function (credentials, rooms) {
                    return connect(credentials, rooms);
                }
            }
    }]);
})();