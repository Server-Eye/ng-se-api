"use strict";

angular.module('ngSeApi').factory('sesAgentNote', ['SesRequest',
  function sesAgentNote(SesRequest) {
        var request = new SesRequest('agent/{aId}/note/{nId}');

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
