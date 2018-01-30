(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceFix', ['SeaRequest',
        function seaComplianceConfig(SeaRequest) {
            var request = new SeaRequest('compliance/fix');

            function update(changes) {
                return request.put({
                    changes: changes
                });
            }

            return {
                update: function (changes) {
                    return update(changes);
                }
            };
        }]);
})();