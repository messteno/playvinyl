'use strict';

require('./validate');
require('./login');
require('./register');
require('./resetPassword');
//require('./setpassword');
require('./resetPasswordConfirm');

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.service('djangoAuth', function auth($q, $http, $cookies, $rootScope, Request) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    var service = {
        /* START CUSTOMIZATION HERE */
        // Change this to point to your Django REST Auth API
        // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
        'API_URL': '/api/rest-auth',
        // Set useSession to true to use Django sessions to store security token.
        // Set useSession to false to store the security token locally and transmit it as a custom header.
        'useSession': true,
            /* END OF CUSTOMIZATION */
        'profile': null,
        'profilePromise': null,
        'request': function(args) {
            args.url = this.API_URL + args.url;

            if (!$rootScope.debug && args.want_ssl) {
                delete args.want_ssl;
                args.url = 'https://' + location.host + args.url;
            }

            return Request.send(args);
        },
        'register': function(username, password1, password2, email, more) {
            var djangoAuth = this;
            var data = {
                'username': username,
                'password1': password1,
                'password2': password2,
                'email': email,
            };
            data = angular.extend(data, more);
            return this.request({
                'method': 'POST',
                'url': '/registration/',
                'want_ssl': true,
                'data': data
            }).then(function(data) {
                if (!djangoAuth.useSession) {
                    $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                    $cookies.token = data.key;
                }
                $rootScope.$broadcast('djangoAuth.logged_in', data);
            });
        },
        'login': function(username, password) {
            var djangoAuth = this;
            return this.request({
                'method': 'POST',
                'url': '/login/',
                'want_ssl': true,
                'data':{
                    'username': username,
                    'password': password
                }
            }).then(function(data) {
                if (!djangoAuth.useSession) {
                    $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                    $cookies.token = data.key;
                }
                $rootScope.$broadcast('djangoAuth.logged_in', data);
            });
        },
        'logout': function() {
            return this.request({
                'method': 'POST',
                'url': '/logout/'
            }).then(function() {
                delete $http.defaults.headers.common.Authorization;
                delete $cookies.token;
                $rootScope.$broadcast('djangoAuth.logged_out');
            }, function() {
                delete $http.defaults.headers.common.Authorization;
                delete $cookies.token;
                $rootScope.$broadcast('djangoAuth.logged_out');
            });
        },
        'changePassword': function(old_password, new_password1, new_password2) {
            return this.request({
                'method': 'POST',
                'url': '/password/change/',
                'want_ssl': true,
                'data':{
                    'old_password': old_password,
                    'new_password1': new_password1,
                    'new_password2': new_password2,
                }
            });
        },
        'resetPassword': function(email) {
            return this.request({
                'method': 'POST',
                'url': '/password/reset/',
                'data':{
                    'email': email
                }
            });
        },
        'user': function() {
            return this.request({
                'method': 'GET',
                'url': '/user/'
            }); 
        },
        'updateUser': function(data) {
            return this.request({
                'method': 'PATCH',
                'url': '/user/',
                'data': data
            }); 
        },
        'verify': function(key) {
            return this.request({
                'method': 'POST',
                'url': '/registration/verify-email/',
                'data': {'key': key} 
            });            
        },
        'confirmReset': function(uid, token, password1, password2) {
            return this.request({
                'method': 'POST',
                'url': '/password/reset/confirm/',
                'want_ssl': true,
                'data':{
                    'uid': uid,
                    'token': token,
                    'new_password1':password1,
                    'new_password2':password2
                }
            });
        },
        'tokenAuth': function(uid, token) {
            var djangoAuth = this;
            return this.request({
                'method': 'POST',
                'url': '/tokenauth/',
                'data': {
                    'uid': uid,
                    'token': token,
                }
            }).then(function(data) {
                if (!djangoAuth.useSession) {
                    $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                    $cookies.token = data.key;
                }
                $rootScope.$broadcast('djangoAuth.logged_in', data);
            });
        },
        'getProfile': function(force) {
            force = force || false;
            if (this.profilePromise === null || force) {
                this.profilePromise = this.request({
                    'method': 'GET',
                    'url': '/profile/'
                });
            }
            var da = this;
            var getProfile = $q.defer();
            if (this.profile !== null && !force) {
                getProfile.resolve(this.profile);
            } else {
                this.profilePromise.then(function(data) {
                    da.profile = data;
                    getProfile.resolve(data);
                }, function() {
                    getProfile.reject('Error');
                });
            }
            return getProfile.promise;
        },
        'initialize': function(url, sessions) {
            this.API_URL = url;
            this.useSession = sessions;
            this.getProfile();
        }
    };
    return service;
});

