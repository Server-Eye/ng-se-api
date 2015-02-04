"use strict";

angular.module('se').controller('ContainerExampleController', ['$scope', 'seaContainer', function($scope, seaContainer) {
    seaContainer.get('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container', result);
    });

    seaContainer.note.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container notes', result);
    });

    seaContainer.proposal.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container proposal', result);
    });

    seaContainer.state.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container state', result);
    });
}]);
