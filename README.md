# ng-se-api
AngularJS wrapper for the Server-Eye web api.

## Introduction
ng-se-api is a collection of AngularJS services to easily send requests to the Server-Eye cloud monitoring api.

The Server-Eye cloud monitoring api provides access to a user's monitored systems, measurements, alerts and many more.
Detailed information about parameters can be found in the [official api documentation](https://api.server-eye.de/docs/1).

## Setup
Just include `dist/ng-se-api.js` in your html file and require the module `ngSeApi`.
Below is an example that shows how to setup `ngSeApi` with an existing api key. You can set the api key at any time in your application using the service `seaApiConfig` instead of the provider.

```js
"use strict";

angular.module('myApp', [ 'ngSeApi' ]);

angular.module('myApp').config(['seaConfigProvider', function(seaConfigProvider) {
    seaConfigProvider.setApiKey('YOUR-SERVER-EYE-API-KEY');
}]);

```

## Usage
More examples in the `examples` folder.

```js
angular.module('myApp').controller('TestController', ['$scope', 'seaAgent', function($scope, seaAgent) {
    // list all available agents
    seaAgent.type.list().then(function(result) {
        console.log('types', result);
    });
}]);
```

## How to build a new version
* install [node.js and npm](https://github.com/joyent/node)
* install [gulp](https://github.com/gulpjs/gulp)
* run `npm install` in the root folder
* Change `version` in `package.json`
* run `gulp`
* check folder `dist` and enjoy your new version :blush:

## Hot to run the examples
* install [node.js and npm](https://github.com/joyent/node)
* install [bower](https://github.com/bower/bower)
* run `node scripts/web-server`