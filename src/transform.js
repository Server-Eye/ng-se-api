(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaTransform', ['SeaTypes',
        function SeaTransform(SeaTypes) {
            function SeaTransform(template) {
                this.parser = ST;
                this.template = template;
            }

            SeaTransform.prototype.parse = function (source) {
                return this.parser.select(angular.extend({}, { SE_TYPES: SeaTypes }, source)).transformWith(this.template).root();
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

    var TPL_AGENT_STATE_HINT_CREATE = {
        "hintType": "{{ $root.SE_TYPES.LOGNOTE_TYPE.N2S[$root.hintType] }}",
        "message": "{{message}}",
        "assignedUser": "{{assignedUser}}",
        "mentionedUsers": "{{mentionedUsers}}",
        "private": "{{private}}",
        "until": "{{#? until}}",
        "aId": "{{aId}}",
        "sId": "{{sId}}",
    }

    var TPL_ME_PASSWORD_UPDATE = {
        "password": "{{password}}",
        "passwordRepeat": "{{passwordre}}",
        "validationPassword": "{{validationPassword}}",
        "code": "{{#? code}}",
    }

    var TPL_CONTAINER_STATE_HINT_CREATE = JSON.parse(JSON.stringify(TPL_AGENT_STATE_HINT_CREATE));
    delete TPL_CONTAINER_STATE_HINT_CREATE["aId"];
    TPL_CONTAINER_STATE_HINT_CREATE["cId"] = "{{cId}}";

    angular.module('ngSeApi').factory('SeaTransformTemplate', [
        function SeaTransformTemplate() {
            return {
                ME: {
                    ME: TPL_ME_ME,
                },
                AGENT: {
                    STATE: {
                        HINT: {
                            CREATE: TPL_AGENT_STATE_HINT_CREATE,
                        },
                    },
                },
                CONTAINER: {
                    STATE: {
                        HINT: {
                            CREATE: TPL_CONTAINER_STATE_HINT_CREATE,
                        },
                    },
                },
                ME: {
                    PASSWORD: {
                        UPDATE: TPL_ME_PASSWORD_UPDATE,
                    },
                },
            };
        }]);
})();