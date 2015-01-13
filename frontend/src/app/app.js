'use strict';

require('angular');
require('angular-bootstrap');
require('angular-bootstrap-tpls');
require('angular-ui-router');
require('angular-route');

window.$ = window.jQuery = require('jquery');
require('owlcarousel');

var requires = [
    'ui.bootstrap',
    'ui.router',
    'ngRoute',
];

var app = angular.module('playvinyl', requires);
app.config(require('./routes'));

app.controller('IndexCtrl', function() {
});

require('./main/main');
