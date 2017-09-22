(function () {
    'use strict';
    var siteLogin = angular.module('siteLogin', ['ngRoute', 'ngCookies', 'authenticationModule', 'saveStateModule']);

    siteLogin.directive("compareTo", ["enumService", 'authenticationService', 'alertsService', function(enumService,  authenticationService, alertsService){
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    }]);

    siteLogin.controller("loginCtrl", ["$scope", '$rootScope', '$routeParams', '$location', 'authenticationService', 'alertsService', 'saveStateService', 'enumService',
	function ($scope, $rootScope, $routeParams, $location, authenticationService, alertsService, saveStateService, enumService) {
            $scope.steps = enumService.getEnum("SignUpStage");
            $scope.setPageLanguage($routeParams.langId);
            $scope.showLogin = $location.path() === ('/login/en' || 'login/he');
            var vm = this;
            vm.login = Login;
            vm.logout = Logout;
            vm.reset = Reset;
            vm.resetRequest = ResetRequest;
            vm.confirmEmail = RequestEmailConfirmation;
            vm.reset.token = $routeParams.resetToken;
            vm.reset.userId = $routeParams.userId;

            (function initController() {
                // reset login status just by going to the login page
                authenticationService.clearCredentials();
                saveStateService.set({});
            })();

            $scope.setTypeOfLogIn = function (type) {
                $scope.typeOfLogIn = type;
            };


            function Logout() {
                if ($scope.typeOfLogIn === 'fb') {
                    $scope.$broadcast('callFbLogout');
                }
                authenticationService.clearCredentials();
            }

            function Login() {
                vm.dataLoading = true;

                if ($scope.typeOfLogIn === 'fb') {
                    $scope.$broadcast('callFbLogin');
                } else {
                    authenticationService.login("SITE", vm.username, vm.password, function (response) {
                        if (response.success) {
                            //check for profile language an current signup stage
                            //and update the view accordingly
                            saveStateService.checkProfileLanguage(response);
                            $scope.$apply();
                        } else {
                            alertsService.showAlert(response);
                            vm.dataLoading = false;
                        }
                    });
                }
            }

            /* Reset a user site password. Requires a special token created, stored and emailed
               to the user from the backend
            */
            function Reset() {
                authenticationService.resetCredentials(vm.reset.userId, vm.reset.token, vm.password, function (response) {
                    if (response.success) {
                        $location.path('/login/' + $routeParams.langId);
                        $scope.$apply();
                    } else {
                        alertsService.showAlert(response);
                    }
                });
            }

            /* Send an email requesting the user to set a new password */
            function ResetRequest() {
                 authenticationService.resetRequest(vm.username, $rootScope.langId, function (response) {
                    if (response.success) {
                        $location.path('/reset-sent/' + $routeParams.langId);
                        $scope.$apply();
                    } else {
                          alertsService.showAlert(response);
                    }
                 });
            }

            /* Send an email with a confirmation code */
            function RequestEmailConfirmation() {
                 authenticationService.requestEmailConfirmation(vm.username, $rootScope.langId, function (response) {
                    if (response.success) {
                        $scope.$apply();
                    } else {
                          alertsService.showAlert(response);
                    }
                 });
            }

    }]);

})();