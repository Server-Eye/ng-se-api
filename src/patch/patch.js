(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter) {
            return {
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
            };
        }]);
})();