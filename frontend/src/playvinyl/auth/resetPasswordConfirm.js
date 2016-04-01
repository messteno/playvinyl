'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app
.controller('ResetPasswordConfirmCtrl', function($scope, $stateParams) {
    var uid = $stateParams.uid || '';
    var token = $stateParams.token || '';
    if ($scope.authenticated === false) {
        $scope.resetPasswordConfirm(uid, token);
    }
})
.controller('ResetPasswordConfirmModalCtrl', function ($scope, $uibModalInstance, $routeParams, djangoAuth, Validate, uid, token) {
    $scope.model = {'new_password1': '','new_password2': ''};
    $scope.confirmReset = function(formData) {
        $scope.errors = [];
        Validate.formValidation(formData, $scope.errors);
        if (!formData.$invalid) {
            djangoAuth.confirmReset(uid, token, $scope.model.new_password1, $scope.model.new_password2)
            .then(function(){
                $uibModalInstance.close('login');
            },function(data){
                $scope.errors = data;
            });
        }
    };
})
;
