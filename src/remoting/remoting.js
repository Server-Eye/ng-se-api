(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit',
    function seaRemoting(SeaRequest, seaRemotingPcvisit) {
            return {
                pcvisit: seaRemotingPcvisit
            };
    }]);
})();