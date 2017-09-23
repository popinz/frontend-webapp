(function () {
    'use strict';
    var facebookLogin = angular.module('facebookLogin', ["imageConverter", "saveStateModule"]);
    facebookLogin.service("facebookService", ['$q', "imageService", 'authenticationService', function ($q, imageService, authenticationService) {
        this.logout = function () {
            var deferred = $q.defer();
            FB.logout(function (response) {
                console.log("FB logout");
            });
            return deferred.promise;
        };
        this.login = function () {
            var deferred = $q.defer();
            FB.login(function (response) {
                if (response.status === 'connected') {
                    var accessToken = response.authResponse.accessToken;
                    FB.api('/me/?fields=id,first_name,email,last_name,gender, picture.width(200).height(200)', function (response) {
                        console.log(response);

                        if (!response || response.error) {
                            deferred.reject('Error occured');
                        } else {
                            response.accessToken = accessToken;
                            deferred.resolve(response);
                        }
                    });
                } else if (response.status === 'not_authorized') {
                    // The person is logged into Facebook, but not your app.
                    deferred.reject('User is not authorized');
                } else {
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                    deferred.reject('User is not logged into FB');
                }
            }, {
                scope: 'public_profile,email'
            });
            return deferred.promise;
        };
        this.signUpUser = function (fbResponse, lang, accountType) {
            var deferred = $q.defer();
            var firstNameEn;
            var lastNameEn;
            var firstNameHe;
            var lastNameHe;
            if (lang === 'en') {
                firstNameEn = fbResponse.first_name;
                lastNameEn = fbResponse.last_name;
            } else if (lang === 'he') {
                firstNameHe = fbResponse.first_name;
                lastNameHe = fbResponse.last_name;
            }

            if (accountType === "parent") {
                gapi.client.parentProfileApi.signUpParent({
                    'accountId': fbResponse.id,
                    'token': fbResponse.accessToken,
                    'tokenType': 'FACEBOOK',
                    'confirm': '0',
                    'email': fbResponse.email,
                    'firstNameEn': firstNameEn,
                    'lastNameEn': lastNameEn,
                    'firstNameHe': firstNameHe,
                    'lastNameHe': lastNameHe,
                    'agreedToTerms': true,
                    'signUpStage': 'START'
                }).execute(
                    function (response) {
                        console.log(response);
                        if (response.result && !response.error) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response.error);
                        }
                    }
                );
            } else if (accountType === "sitter") {
                imageService.imgToBase64(fbResponse.picture.data.url)
                    .then(function (response) {
                        gapi.client.sitterProfileApi.signUpSitter({
                            'accountId': fbResponse.id,
                            'token': fbResponse.accessToken,
                            'tokenType': 'FACEBOOK',
                            'confirm': '0',
                            'email': fbResponse.email,
                            'firstNameEn': firstNameEn,
                            'lastNameEn': lastNameEn,
                            'firstNameHe': firstNameHe,
                            'lastNameHe': lastNameHe,
                            'agreedToTerms': true,
                            'gender': fbResponse.gender.toUpperCase(),
                            'img': response,
                            'signUpStage': 'START'
                        }).execute(
                            function (response) {
                                console.log(response);
                                if (response.result && !response.error) {
                                    deferred.resolve(response);
                                } else {
                                    deferred.reject(response.error);
                                }
                            });
                    });
            }
            return deferred.promise;
        };
        // Login where we don't know if the account type is sitter or parent
        this.loginUser = function (fbResponse, lang) {
            var deferred = $q.defer();
            gapi.client.sitterProfileApi.checkProfileType({
                'accountId': fbResponse.id,
                'tokenType': 'FACEBOOK'
            }).execute(function (response) {
                console.log(response);
                if (response.result && !response.error) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response.error);
                }
            });
            return deferred.promise;
        };
	}]);
    // end of service

    facebookLogin.controller("facebookLoginCtrl", ["$scope", "$rootScope", '$routeParams', "facebookService", "$location", "saveStateService", "alertsService", "authenticationService", 'enumService', function ($scope, $rootScope, $routeParams, facebookService, $location, saveStateService, alertsService, authenticationService, enumService) {

        $scope.steps = enumService.getEnum("SignUpStage");

        $scope.$on('callFbLogin', function (e) {
            $scope.facebookLogin();
        });

        $scope.$on('callFbLogout', function (e) {
            $scope.facebookLogout();
        });

        $scope.setTypeOfLogIn = function (type) {
            $scope.typeOfSignUp = type;
            $scope.facebookLogin();
        };

        $scope.facebookLogin = function () {
            facebookService.login().then(function (fbResponse) {
                console.log(fbResponse);
                $scope.$watchGroup(['sitter_api_ready', 'parent_api_ready'], function () {
                    if ($scope.sitter_api_ready === true && $scope.parent_api_ready === true) {
                        // Save the login credentials to the authentication service
                        // that will persist the credentials for the web session
                        var authResponse = {};
                        authResponse.email = fbResponse.id; // response.email;
                        authResponse.tokenType = 'FACEBOOK';
                        authResponse.logInToken = fbResponse.accessToken;
                        authResponse.accountId = fbResponse.id;
                        authResponse.userType = $rootScope.accountType;
                        switch($rootScope.lang){
                            case 'en':
                                authResponse.firstNameEn = fbResponse.first_name;
                                authResponse.lastNameEn = fbResponse.last_name;
                                break;
                            case 'he':
                                authResponse.firstNameHe = fbResponse.first_name;
                                authResponse.lastNameHe = fbResponse.last_name;
                                break;
                        }
                        authenticationService.setCredentials(authResponse);
                        // If there is not userType of sitter or parent defined, this is a bare
                        // login. Try loading both types. The one that succeeds defines the userType
                        if (!$rootScope.user.userType) {
                            facebookService.loginUser(fbResponse, $scope.lang)
                                .then(function (response) {
                                    console.log(response);
                                    if (response.profileType === 'SITTER' || response.profileType === 'PARENT') {
                                        //$rootScope.user.userType = response.profileType.toLowerCase();
                                        authResponse.userType = response.profileType.toLowerCase();
                                        authenticationService.setCredentials(authResponse);
                                        facebookService.signUpUser(fbResponse, $scope.lang, $rootScope.user.userType).then(
                                            function (fbResponse) {
                                                return $scope.facebookResponse(fbResponse);
                                            },
                                            function (reason) {
                                                console.log(reason);
                                                if (reason !== undefined)
                                                    alertsService.showAlert(reason.message);
                                                $('#facebookSignupButton').prop('disabled', false);
                                                $('#siteSignupButton').prop('disabled', false);
                                            });
                                    }
                                    else{
                                        $rootScope.user = {};
                                        alertsService.showAlert("First time user");
                                    }
                                });
                        }
                        // A userType has been defined. This only happens if we are coming through
                        // a sign-up flow, where we choose the type of user we want to create
                        else {
                            facebookService.signUpUser(fbResponse, $scope.lang, $rootScope.user.userType).then(
                                function (fbResponse) {
                                    return $scope.facebookResponse(fbResponse);
                                },
                                function (reason) {
                                    console.log(reason);
                                    if (reason !== undefined)
                                        alertsService.showAlert(reason.message);
                                    $('#facebookSignupButton').prop('disabled', false);
                                    $('#siteSignupButton').prop('disabled', false);
                                });
                        }
                    }
                });
            }, function (reason) {
                if (reason !== undefined)
                    alert('Failed: ' + reason.message);
                $('#facebookSignupButton').prop('disabled', false);
                $('#siteSignupButton').prop('disabled', false);
            });
        };

        /*
         * FIXME - this function has dependencies on the parent scope (signup controller), which
         * couples the FB login response processing to the signup module. This prevents the login
         * module from interacting cleanly with the the FB login module
         */
        $scope.facebookResponse = function (response) {
            console.log(response);

            if (response.result.age === 0) {
                delete response.result.age;
            }
            if (response.result.homeNumber === 0) {
                delete response.result.homeNumber;
            }

            response.userType = $rootScope.accountType = $rootScope.user.userType

            //check for profile language an current signup stage
            var res = saveStateService.checkProfileLanguage(response);
            //pass the result to the parent scope to update scope variables
            $scope.$emit("loginResponseReady", res);
        };

        // May not actually need/want to log out of facebook
        $scope.facebookLogout = function () {
            facebookService.logout().then(function (response) {
                console.log(response);
            });
        };
    }]);
})();