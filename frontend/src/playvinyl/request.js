'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.service('Request', function($q, $http, $cookies) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    var service = {
        'useSession': true,
        'send': function(args) {
            // Let's retrieve the token from the cookie, if available
            // if ($cookies.token) {
            //     $http.defaults.headers.common.Authorization = 'Token ' + $cookies.token;
            // }

            // Continue
            args = args || {};
            var deferred = $q.defer(),
                url = args.url,
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
                // console.log('error syncing with: ' + url);
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
                        data.non_field_errors = ['Невозможно установить соединение с сервером'];
                    }
                    // or if the data is null, then there was a timeout.
                    if (data === null) {
                        // Inject a non field error alerting the user
                        // that there's been a timeout error.
                        data = {};
                        data.status = 0;
                        data.non_field_errors = ['Превышено время ожидания ответа от сервера, попробуйте еще раз'];
                    }
                } else if (status === 405) {
                    data = {};
                    data.non_field_errors = ['Недопустимый запрос'];
                } else if (status === 500) {
                    data = {};
                    data.non_field_errors = ['Ошибка на сервере'];
                }
                deferred.reject(data, status, headers, config);
            }));
            return deferred.promise;
        },
    };
    return service;
});

