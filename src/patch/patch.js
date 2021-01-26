(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter', 'seaPatchHelper', 'seaPatchTask',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter, seaPatchHelper, seaPatchTask) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/customers')),
                requestCategories = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/categories'));

            function listCustomers() {
                return request.get();
            }

            function listCategories(customerId) {
                return requestCategories.get({ customerId: customerId });
            }

            return {
                customer: {
                    list: listCustomers
                },
                category: {
                    list: function (customerId) {
                        return listCategories(customerId)
                    },
                },
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
                task: seaPatchTask,
            };
        }]);
})();