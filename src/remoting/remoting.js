(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork',
    function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork) {
            return {
                pcvisit: seaRemotingPcvisit,
                network: seaRemotingNetwork
            };
    }]);
})();