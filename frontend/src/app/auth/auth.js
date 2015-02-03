'use strict';

require('./validate');
require('./login');
require('./register');
require('./resetPassword');
require('./resetPasswordConfirm');

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.service('djangoAuth', function auth($q, $http, $cookies, $rootScope) {
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
        'authenticated': null,
        'authPromise': null,
        'request': function(args) {
            // Let's retrieve the token from the cookie, if available
            if ($cookies.token) {
                $http.defaults.headers.common.Authorization = 'Token ' + $cookies.token;
            }

            // Continue
            args = args || {};
            var deferred = $q.defer(),
                url = this.API_URL + args.url,
                method = args.method || 'GET',
                params = args.params || {},
                data = args.data || {};
            // Fire the request, as configured.
            $http({
                url: url,
                withCredentials: this.useSession,
                method: method.toUpperCase(),
                headers: {'X-CSRFToken': $cookies.csrftoken},
                params: params,
                data: data
            })
            .success(angular.bind(this, function(data, status) {
                deferred.resolve(data, status);
            }))
            .error(angular.bind(this, function(data, status, headers, config) {
                console.log('error syncing with: ' + url);
                // Set request status
                if (data) {
                    try {
                        data.status = status;
                        if (data.__all__) {
                            data.non_field_errors = data.__all__;
                        }
                    } catch(e) {
                        data = {};
                        data.status = status;
                        data.non_field_errors = ['Неверный ответ от сервера'];
                    }
                }
                if (status === 0) {
                    if (data === '') {
                        data = {};
                        data.status = 0;
                        data.non_field_errors = ['Could not connect. Please try again.'];
                    }
                    // or if the data is null, then there was a timeout.
                    if (data === null) {
                        // Inject a non field error alerting the user
                        // that there's been a timeout error.
                        data = {};
                        data.status = 0;
                        data.non_field_errors = ['Server timed out. Please try again.'];
                    }
                } else if (status === 500) {
                    data = {};
                    data.non_field_errors = ['Ошибка на сервере.'];
                }
                deferred.reject(data, status, headers, config);
            }));
            return deferred.promise;
        },
        'register': function(username, password1, password2, email, more) {
            var djangoAuth = this;
            var data = {
                'username': username,
                'password1': password1,
                'password2': password2,
                'email': email
            };
            data = angular.extend(data, more);
            return this.request({
                'method': 'POST',
                'url': '/registration/',
                'data' :data
            }).then(function(data) {
                if (!djangoAuth.useSession) {
                    $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                    $cookies.token = data.key;
                }
                djangoAuth.authenticated = true;
                $rootScope.$broadcast('djangoAuth.logged_in', data);
            });
        },
        'login': function(username, password) {
            var djangoAuth = this;
            return this.request({
                'method': 'POST',
                'url': '/login/',
                'data':{
                    'username':username,
                    'password':password
                }
            }).then(function(data) {
                if (!djangoAuth.useSession) {
                    $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                    $cookies.token = data.key;
                }
                djangoAuth.authenticated = true;
                $rootScope.$broadcast('djangoAuth.logged_in', data);
            });
        },
        'logout': function() {
            var djangoAuth = this;
            return this.request({
                'method': 'POST',
                'url': '/logout/'
            }).then(function() {
                delete $http.defaults.headers.common.Authorization;
                delete $cookies.token;
                djangoAuth.authenticated = false;
                $rootScope.$broadcast('djangoAuth.logged_out');
            });
        },
        'changePassword': function(password1, password2) {
            return this.request({
                'method': 'POST',
                'url': '/password/change/',
                'data':{
                    'new_password1': password1,
                    'new_password2': password2
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
        'profile': function() {
            return this.request({
                'method': 'GET',
                'url': '/user/'
            }); 
        },
        'updateProfile': function(data) {
            return this.request({
                'method': 'PATCH',
                'url': '/user/',
                'data':data
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
                'data':{
                    'uid': uid,
                    'token': token,
                    'new_password1':password1,
                    'new_password2':password2
                }
            });
        },
        'authenticationStatus': function(restrict, force) {
            // Set restrict to true to reject the promise if not logged in
            // Set to false or omit to resolve when status is known
            // Set force to true to ignore stored value and query API
            restrict = restrict || false;
            force = force || false;
            if (this.authPromise === null || force) {
                this.authPromise = this.request({
                    'method': 'GET',
                    'url': '/user/'
                });
            }
            var da = this;
            var getAuthStatus = $q.defer();
            if (this.authenticated !== null && !force) {
                // We have a stored value which means we can pass it back right away.
                if (this.authenticated === false && restrict) {
                    getAuthStatus.reject('User is not logged in.');
                } else {
                    getAuthStatus.resolve();
                }
            } else {
                // There isn't a stored value, or we're forcing a request back to
                // the API to get the authentication status.
                this.authPromise.then(function() {
                    da.authenticated = true;
                    getAuthStatus.resolve();
                }, function() {
                    da.authenticated = false;
                    if (restrict) {
                        getAuthStatus.reject('User is not logged in.');
                    } else {
                        getAuthStatus.resolve();
                    }
                });
            }
            return getAuthStatus.promise;
        },
        'initialize': function(url, sessions) {
            this.API_URL = url;
            this.useSession = sessions;
            return this.authenticationStatus();
        }
    };
    return service;
});
