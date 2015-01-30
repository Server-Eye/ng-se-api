"use strict";

angular.module('se').controller('ContainerExampleController', ['$scope', 'sesContainer', function($scope, sesContainer) {
    sesContainer.get('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container', result);
    });

    sesContainer.note.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container notes', result);
    });

    sesContainer.proposal.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container proposal', result);
    });

    sesContainer.state.list('7fdbec26-2897-4cee-a3fa-ab22a5d89b44').then(function(result) {
        console.log('container state', result);
    });
}]);
