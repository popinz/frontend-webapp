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
 (function(){
	var userAccount = angular.module('userAccount', ['ngRoute', "langCheck"]);

	userAccount.controller("contactCtrl", ["$scope", '$routeParams', function($scope, $routeParams){
	    $scope.setPageLanguage($routeParams.langId);

        $scope.setContactMethod = function(method)
        {
            $scope.contactMethod = method;
        }

    }]);


	userAccount.directive("contactSitter", function () {
	    return {
	        restrict: 'E',
	        templateUrl: "partials/contact-sitter.html",
	        controller: ["$scope", "$rootScope", "translateFilter", function ($scope, $rootScope, translateFilter)
	            {
	                $scope.contactSitter = function () {
	                    console.log();
	                    if ($scope.contactMethod === 'mail') {
	                        if ($scope.accountType === "sitter") {
	                            $scope.sitter = {};
	                        } else if ($scope.accountType === "parent") {
	                            $scope.parent = {};
	                        }
	                    } else if ($scope.contactMethod === 'phone') {
	                        $scope.$watch("account_api_ready", function () {
	                            if ($scope.account_api_ready === true) {
	                                gapi.client.accountSettingsApi.sendNotification({
	                                    'accountId': $scope.parent.email,
	                                    'token': $scope.parent.password,
	                                    'tokenType': "SITE"
	                                }).execute(function (response) {
	                                    console.log(response);
	                                    if (response.result && !response.error) {
	                                        $scope.setRootScope(response);
	                                        // $rootScope.user.userType = "parent";
	                                        $scope.$apply();
	                                    } else {
	                                        var r;
	                                        if (response.error.message === "java.security.AccessControlException: No permission to user with ID: null") {
	                                            r = confirm("You do not have permission to contact this user");
	                                        } else if (response.error.message) {
	                                            r = confirm(response.error.message);
	                                        } else {
	                                            r = confirm("Something went wrong! Please, try again in 5 seconds!");
	                                        }
	                                        if (r === true) {
	                                            // $scope.createParentProfile();
	                                        }
	                                    }
	                                });
	                            }
	                        });
	                    }
	                };
			     }]
	    };
    });
    
})();