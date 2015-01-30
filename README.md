# ng-se-api
AngularJS wrapper for the Server-Eye web api.

## Introduction
ng-se-api is a collection of AngularJS services to easily send requests to the Server-Eye cloud monitoring api.

The Server-Eye cloud monitoring api provides access to a user's monitored systems, measurements, alerts and many more.
Detailed information about parameters can be found in the official [api documentation][].

[api documentation]: https://api.server-eye.de/docs/1

## Setup
Just include `dist/ng-se-api.js` in your html file and require the module `ngSeApi`.
Below is an example that shows how to setup `ngSeApi` with an existing api key. You can set the api key at any time in your application using the service `sesApiConfig` instead of the provider.

```js
"use strict";

angular.module('myApp', [ 'ngSeApi' ]);

angular.module('myApp').config(['sesApiConfigProvider', function(sesApiConfigProvider) {
    sesApiConfigProvider.setApiKey('YOUR-SERVER-EYE-API-KEY');
}]);

```

## Usage
More examples in the `examples` folder.

```js
angular.module('myApp').controller('TestController', ['$scope', 'sesAgent', function($scope, sesAgent) {
    // list all available agents
    sesAgent.type.list().then(function(result) {
        console.log('types', result);
    });
}]);
```

## How to build a new version
- install node.js and npm
- run `npm install` in the root folder
- Change `version` in `package.json`
- run `gulp`
- check folder `dist` and enjoy your new version :)