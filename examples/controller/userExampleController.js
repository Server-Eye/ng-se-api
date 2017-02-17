"use strict";

angular.module('se').controller('UserExampleController', ['$scope', 'seaUser', function ($scope, seaUser) {
    seaUser.search({ query: 'kim' }).then(function (result) {
        console.log('user search', result);
    });

    seaUser.location.update({
        uId: "4ab9f8f0-9ee8-11e3-958e-553482e2ac5c",
        geo: {
            "lat": "49.40443265",
            "lon": "6.9662669424873"
        }
    }).then(function (result) {
        console.log('user location update', result);
    });

    seaUser.location.get({
        uId: "4ab9f8f0-9ee8-11e3-958e-553482e2ac5c"
    }).then(function (result) {
        console.log('user location update', result);
    });
}]);
