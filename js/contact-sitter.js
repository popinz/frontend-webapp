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