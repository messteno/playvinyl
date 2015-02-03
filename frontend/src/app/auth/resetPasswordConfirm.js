'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.controller('ResetPasswordConfirmCtrl', function ($scope, $modalInstance, $routeParams, djangoAuth, Validate, uid, token) {
    $scope.model = {'new_password1': '','new_password2': ''};
    $scope.complete = false;
    $scope.confirmReset = function(formData) {
        $scope.errors = [];
        Validate.formValidation(formData, $scope.errors);
        if (!formData.$invalid) {
            djangoAuth.confirmReset(uid, token, $scope.model.new_password1, $scope.model.new_password2)
                .then(function(){
                    $modalInstance.close('login');
                },function(data){
                    $scope.errors = data;
                });
        }
    };
});
