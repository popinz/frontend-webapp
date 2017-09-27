/*
 *  Copyright (C) 2017 Popinz.co
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 (function () {
    'use strict';

    var authentication = angular.module("authenticationModule", ["translateModule"]);
    authentication.service("authenticationService", ["translateService", '$rootScope', '$cookieStore', '$timeout',

    function(authenticationService, $rootScope, $cookieStore, $timeout) {
        var service = {};
        service.login = Login;
        service.setCredentials = SetCredentials;
        service.clearCredentials = ClearCredentials;
        service.refreshCredentials = RefreshCredentials;
        service.updateNames = UpdateNames;
        service.resetCredentials = ResetCredentials;
        service.resetRequest = ResetRequest;
        service.requestEmailConfirmation = RequestEmailConfirmation;
        RefreshCredentials($rootScope);
        return service;

        function Login(type, username, password, callback) {
            // var authdata = btoa(username + ':' + password);
            gapi.client.sitterProfileApi.getLogInTokenOfProfile({'email': username.toLowerCase(), 'password': password}).execute(function (response) {
					if (response.result && !response.error){
						response.userType = "sitter"
						response.tokenType = type;
						SetCredentials(response);
						response.success = true;
						callback(response);
					}
					else {
					    gapi.client.parentProfileApi.getLogInTokenOfProfile({'email': username.toLowerCase(), 'password': password}).execute(function (response) {
                        	if (response.result && !response.error){
                        		response.userType = "parent";
                        		response.tokenType = type;
                        		SetCredentials(response);
                        		response.success = true;
                        	}
                        	else {
                        		response.success = false;
                            	response.message = 'Email/Username or password is incorrect';
                        	}
                        	callback(response);
                        });
					}
			   });
        };

        //used to update names only
        //use case: a user want to change names received from fb (to Hebrew ones, for example)
        function UpdateNames(firstNameEn, lastNameEn, firstNameHe, lastNameHe)
        {
            $rootScope.user.firstNames = {};
            $rootScope.user.lastNames = {};
            if(firstNameEn)
                $rootScope.user.firstNames["en"] = firstNameEn;
            if(firstNameHe)
                $rootScope.user.firstNames["he"] = firstNameHe;
            if(lastNameEn)
                $rootScope.user.lastNames["en"] = lastNameEn;
            if(lastNameHe)
                $rootScope.user.lastNames["he"] = lastNameHe;
            $cookieStore.put('user', $rootScope.user);
        }

        function SetCredentials(response) {
            $rootScope.user = {
                creds: {
                    accountId: response.email,
                    token:  response.logInToken,
                    tokenType: response.tokenType
                },
                id: response.id,
                userType: response.userType
            };
            UpdateNames(response.firstNameEn, response.lastNameEn, response.firstNameHe,response.lastNameHe);
            //$cookieStore.put('user', $rootScope.user);
            //$rootScope.accountType = response.userType;
        };

        function ClearCredentials() {
            $rootScope.user = {
                creds: {
                    accountId: {},
                    token: {},
                    tokenType: {}
                }
            };
            $cookieStore.remove('user');
        };

        function RefreshCredentials(scope) {
            // keep user logged in after page refresh
            scope.user = $cookieStore.get('user') || {};
            //$rootScope.accountType = scope.user.accountType;
        };

        /* Reset the user ID's password to a new password.
           The input token must be on the reset table
        */
        function ResetCredentials(id, token, password, callback) {
            gapi.client.accountSettingsApi.resetPassword({
                'id': id,
                'resetToken': token,
                'password': password
            }).execute(function (response) {
                    if (response.result && !response.error) {
                        response.success = true;
                    }
                    else {
                        response.message = 'Password reset request is invalid. Please make a new request.';
                        response.code = response.error;
                        response.success = false;
                    }
                    callback(response);
                }
            );
        }

        /* Send an email to a registered user with a link to reset their password */
        function ResetRequest(email, lang, callback) {
            gapi.client.accountSettingsApi.requestResetPassword({
                'accountId': email,
                'tokenType': "SITE",
                'accountType': "unknown", // put unknown if we can't tell
                'language': lang
            }).execute(function (response) {
                    if (response.result && !response.error) {
                        response.success = true;
                    } else {
                        response.message = 'Email/Username is incorrect';
                        response.code = response.error;
                        response.success = false;
                    }
                    callback(response);
                }
            );
        }

        /* Send an email to a new site user with a confirmation code */
        function RequestEmailConfirmation(email, lang, callback) {
            gapi.client.accountSettingsApi.requestEmailConfirmation({
                'email': email,
                'language': lang
            }).execute(function (response) {
                    if (response.result && !response.error) {
                        response.success = true;
                    } else {
                        response.message = 'Email/Username is invalid';
                        response.code = response.error;
                        response.success = false;
                    }
                    if (callback !== undefined)
                        callback(response);
                }
            );
        }

    }]);

})();