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
