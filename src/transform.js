(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaTransform', [
        function SeaTransform() {
            function SeaTransform(template) {
                this.parser = ST;
                this.template = template;
            }

            SeaTransform.prototype.parse = function (source) {
                return this.parser.select(source).transformWith(this.template).root();
            };

            return SeaTransform;
        }]);
})();

(function () {
    "use strict";

    var TPL_ME_ME = {
        "userId": "{{userId}}",
        "customerId": "{{customer.customerId}}",
        "substitudeId": "",
        "customerNumberExtern": "{{distributor.customerNumberExtern}}",
        "companyName": "",
        "country": "",
        "street": "",
        "streetNumber": "",
        "zipCode": "",
        "city": "",
        "licenseType": "",
        "role": "{{role}}", // needs to be transformed to a number
        "roles": {
            "{{#each roles}}": "{{this.toLowerCase()}}"
        },
        "surname": "{{surname}}",
        "prename": "{{prename}}",
        "email": "{{email}}",
        "phone": "{{phone}}",
        "customerSettings": {},
        "distributor": {
            "id": "{{distributor.customerId}}",
            "customerNumberExtern": "{{distributor.customerNumberExtern}}"
        },
        "distributorInformation": {
            "website": "{{distributor.information.website}}",
            "phone": "{{distributor.information.phone}}",
            "hasLogo": "{{distributor.information.hasLogo}}"
        },
        "settings": {
            "sendSummary": "{{settings.sendSummary}}",
            "defaultNotifyEmail": "{{settings.defaultNotifyEmail}}",
            "defaultNotifyPhone": "{{settings.defaultNotifyPhone}}",
            "defaultNotifyTicket": "{{settings.defaultNotifyTicket}}",
            "timezone": "{{settings.timezone}}",
            "theme": "{{settings.theme}}",
            "webNotification": "{{settings.webNotification}}",
            "highlightCustomers": "{{settings.highlightCustomers}}",
            "defaultViewFilter": "{{settings.defaultViewFilter}}",
            "agreeAnalytics": "{{settings.agreeAnalytics}}"
        },
        "customers": {
            "{{#each $root.managedCustomers}}": {
                "customer_id": "{{customerId}}"
            }
        },
        "isDistributor": "{{isDistributor}}",
        "accessTo": "{{accessTo}}",
        "productVersion": "",
        "hasKeyPair": "{{hasKeyPair}}"
    }

    angular.module('ngSeApi').factory('SeaTransformTemplate', [
        function SeaTransformTemplate() {
            return {
                ME: {
                    ME: TPL_ME_ME,
                },
            };
        }]);
})();