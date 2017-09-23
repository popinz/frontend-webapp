(function(){
	var signup = angular.module('signupDetails', ['ngRoute', 'facebookLogin', 'availabilityCalendar', "jobs", "chooseNeighborhood", "chooseCity", "langCheck", 'sitterDirectives', 'jobDirectives', 'alertsModule', 'saveStateModule']);

	signup.controller("signupCtrl", ["$scope", "$rootScope", '$routeParams',"translateService", "$location", "saveStateService", "authenticationService",  function($scope, $rootScope, $routeParams, translateService, $location, saveStateService, authenticationService){
	    $scope.setPageLanguage($routeParams.langId);

        $scope.setTypeOfSignUp = function(type)
        {
            $scope.typeOfSignUp = type;
        }
    }]);

	signup.directive("zeroStep", ["enumService", "authenticationService", function(enumService, authenticationService){
		return{
			restrict:'E',
			templateUrl: "partials/zero-step.html",
			controller: ["$scope", "$rootScope", "translateFilter", "saveStateService", "alertsService", function($scope, $rootScope, translateFilter, saveStateService, alertsService)
			{
			    $scope.parent = {};
			    $scope.sitter = {};
			    var sitterInfo = saveStateService.get();
                if(angular.equals(sitterInfo, {})){
                    if(!angular.equals($rootScope.user, {}) && $rootScope.user.userType === "sitter"){
                        $scope.$watch("sitter_api_ready", function(){
                            if($scope.sitter_api_ready){
                                gapi.client.sitterProfileApi.getSitterProfile($rootScope.user.creds).execute(
                                    function (response) {
                                        if (response.result && !response.error){
                                            response.userType = "sitter";
                                            //check for profile language an current signup stage
                                            var restoredState = saveStateService.checkProfileLanguage(response);
                                            //update scope variables
                                            if(restoredState)
                                                setScopeFromResponse(restoredState);
                                            $scope.$apply();
                                        }
                                        else{
                                            alertsService.showAlert(response.error.message);
                                        }
                                    }
                                );
                            }
                        });
                    }
                    else {
                        $scope.sitterDetails = {currentStep : 0};
                        $scope.parentDetails = {};
                    }
                }
                else
                {
                    //check for profile language an current signup stage
                    var restoredState = saveStateService.checkProfileLanguage(sitterInfo);
                    //update scope variables
                    setScopeFromResponse(restoredState);
                    //$rootScope.accountType= 'sitter';
                }

                $scope.$on("loginResponseReady", function(event, res){
                    setScopeFromResponse(res);
                });

                function setScopeFromResponse(response){
                    $scope.steps = response.steps;
                    $scope.sitterDetails = response.sitterDetails;
                     // no state or signup stages at this time for parents
                     $scope.parentDetails = {};
                    if(response.userType === "sitter")
                        $scope.sitter = response.result;
                    else
                        $scope.parent = response.result;
                    if(!$rootScope.accountType)
                        $rootScope.accountType = response.userType;

                }
				$scope.chooseNextStep = function(){
				    if($scope.typeOfSignUp === 'mail')
				    {
                      //  $scope.zeroStep = false;
                        $scope.showPass = true;
                        $scope.sitterDetails.currentStep++;
                        hj('vpv', '/sign-up/' + $scope.sitterDetails.currentStep);
				    }
				    else if($scope.typeOfSignUp === 'fb')
				    {
				        $scope.$broadcast ('callFbLogin');

				        $('#facebookSignupButton').prop('disabled', true);
				        $('#siteSignupButton').prop('disabled', true);
				    }
                    authenticationService.clearCredentials();
				};
				$scope.$on("$destroy", function() {
                    saveStateService.empty();
                });
			}]
		};
	}]);

	signup.directive("sitterDetails", ["enumService", "$window", "$location", "saveStateService", "$timeout", "alertsService","authenticationService", function(enumService, $window, $location, saveStateService, $timeout, alertsService, authenticationService){
		return{
			restrict:'E',
			templateUrl: "partials/sitter-details.html",
			controller: ["$scope", "$rootScope", function($scope, $rootScope){
			    var timer;
			    if(!$scope.steps)
			        $scope.steps=enumService.getEnum("SignUpStage");
			    $scope.howHeards = enumService.getEnum("HowHeard");
			    $scope.passwordPattern = "[\x00-\x7F]{8,}";

			    $scope.setRootScope = function(response, accountType){
			        response.tokenType = "SITE";
			        response.userType = accountType;
			        authenticationService.setCredentials(response);
                }

			    $scope.createProfile = function () {
			            $('#getStartedButton').prop('disabled', true);
                        if($rootScope.user.creds.tokenType === "FACEBOOK")
                        {
                             $scope.sitter.signedToNewsletter = true;
                             gapi.client.sitterProfileApi.updateSitterProfile($.extend({}, $scope.sitter, $rootScope.user.creds, {'signUpStage':$scope.steps[$scope.sitterDetails.currentStep].name})).execute(function(response){
                                if (response.result && !response.error){
                                    //update first and last names in the rootscope and in cookies in case they were changed (from those that were received from fb)
                                    authenticationService.updateNames(response.firstNameEn, response.lastNameEn, response.firstNameHe, response.lastNameHe);
                                    $scope.sitterDetails.currentStep++;
                                    $scope.sitter.signUpStage = $scope.steps[$scope.sitterDetails.currentStep].name;
                                    hj('vpv', '/sign-up/' + $scope.sitterDetails.currentStep);
                                    $scope.$apply();
                                    $window.scrollTo(0,0);
                                }
                                else
                                {
                                    alertsService.showAlert(response.error.message);
                                    $('#getStartedButton').prop('disabled', false);
                                }
                             });
                        }
                        else
                        {
                            $.extend($scope.sitter, {'agreedToTerms': true, 'signedToNewsletter': true});
                            $scope.$watch('sitter_api_ready', function(){
                                if($scope.sitter_api_ready === true)
                                {
                                    if ($scope.sitter.confirm === undefined) {
                                        authenticationService.requestEmailConfirmation($scope.sitter.email, $rootScope.lang,
                                        function (response) {
                                              if (response.success) {
                                                    $scope.sitterDetails.confirm = true;
                                                    $scope.$apply();
                                              } else {
                                                    alertsService.showAlert(response.error.message);
                                              }
                                        });

                                    }
                                    else
                                    {
                                    gapi.client.sitterProfileApi.signUpSitter($.extend({}, {'accountId': $scope.sitter.email, 'token': $scope.sitter.password, 'tokenType': "SITE", 'signUpStage':"FIRST", 'confirm':$scope.sitter.confirm}, $scope.sitter)
                                    ).execute(function (response) {
                                        if (response.result && !response.error)
                                        {
                                            $scope.setRootScope(response, "sitter");
                                            var sitterInfo = response;
                                            //check for profile language an current signup stage
                                            var restoredState = saveStateService.checkProfileLanguage(sitterInfo);
                                            //pass the result to the parent scope to update scope variables
                                            $scope.$emit("loginResponseReady", restoredState);
                                            $scope.$apply();
                                            $window.scrollTo(0,0);
                                            //if currentStep turns out to be "COMPETED", redirect to sitter profile
                                            if($scope.sitter.signUpStage==="COMPLETED"){
                                                //before redirecting empty sitter object in saveStateService.
                                                //so that if a user returns from sitter profile to signup,
                                                //he would see the zero step of signup
                                                saveStateService.empty();
                                                $location.path('/sitter-profile/'+$rootScope.lang);
                                            }
                                        }
                                        else
                                        {
                                            alertsService.showAlert(response.error.message);
                                            $('#getStartedButton').prop('disabled', false);
                                        }
                                    });
                                    }
                                }
                            });
                        }
                };


                //the function choose the current signup steps and invokes input validation and gathering data from checkboxes
                //if nothing of these needed calls saveUpdate()
                $scope.updateSitterProfile = function(){
                    switch($scope.sitter.signUpStage){
                        case 'SECOND':
                            $scope.$broadcast("resizeImage");
                            break;
                        case 'FORTH':
                            $scope.$broadcast("validateAge", $scope.sitter.age, "validateAboutMe", $scope.sitter.aboutMeEn, $scope.sitter.aboutMeHeb);
                            break;
                        case 'FIFTH':
                            $scope.$broadcast("validateExperienceText", $scope.sitter.experienceStringEn, $scope.sitter.experienceStringHeb,
                                            "gatherExperiences", "gatherSkills", "gatherOfferings", "gatherHomeworkHelp");
                            break;
                        case 'SIXTH':
                            $scope.$broadcast("gatherJobTypes", "gatherScheduleUpdate");
                            break;
                        case 'SEVENTH':
                            $scope.$broadcast("gatherCities", "gatherNeighborhoods");
                            break;
                        case "EIGHTH":
                            $scope.$broadcast("gatherLanguages");
                            break;
                        default:
                            $scope.saveUpdate();
                            break;
                    }
                };

                //listens for "imageReady" event coming from child
                // if validation passed, assigns result to sitter object
                //and calls saveUpdate()
                $scope.$on("imageReady", function(event, validationRes, res){
                    if(validationRes)
                    {
                        $scope.sitter.img = res;
                        $scope.saveUpdate();
                    }
                });

                //listens to "gathered" event coming from child
                //assigns received result to an appropriate sitter field
                //calls repeatOrSave() for further actions
                $scope.$on("gathered", function(event, enumType, res, additionalArgs){
                    switch(enumType)
                    {
                        case "offerings":
                            $scope.sitter.offerings = res;
                            break;
                        case "homeworkHelps":
                            $scope.sitter.homeworkHelp = res;
                            break;
                        case "experiences":
                            $scope.sitter.experience = res;
                            break;
                        case "skills":
                            $scope.sitter.skills = res;
                            break;
                        case "jobTypes":
                            $scope.sitter.jobType = res;
                            break;
                        case "times":
                            $scope.sitter.schedule = res;
                            break;
                        case "cities":
                            $scope.sitter.whereOutside = [];
                            if(res !== undefined)
                                $scope.sitter.whereOutside=res;
                            else if($scope.sitter.city !== "JERUSALEM")
                            {
                                $scope.sitter.whereOutside.push($scope.sitter.city);
                            }
                            $scope.sitter.workOutsideTheCity = $scope.sitter.whereOutside.length === 0?false:true;
                            break;
                        case "neighborhoods":
                            $scope.sitter.neighborhoodsWork = [];
                            if(res!==undefined)
                                $scope.sitter.neighborhoodsWork=res;
                            else if($scope.sitter.city === "JERUSALEM")
                            {
                                $scope.sitter.neighborhoodsWork.push($scope.sitter.neighborhood);
                            }
                            break;
                        case "languages":
                            $scope.sitter.languages = res;
                        default:
                            break;
                    }
                    $scope.repeatOrSave(additionalArgs);
                });

                $scope.$on("validated", function(event, res, additionalArgs){
                    if(res)
                    {
                        $scope.repeatOrSave(additionalArgs);
                    }
                });

                $scope.repeatOrSave = function(additionalArgs)
                {
                    if(additionalArgs.length>0)
                    {
                         $scope.$broadcast.apply($scope, additionalArgs);
                    }
                    else
                    {
                        console.log($scope.sitter);
                         $scope.saveUpdate();
                    }
                };

                $scope.saveUpdate = function(){
                     $('#updateSitterSkillsButton').blur();
                     //disable "next" button to avoid multiple clicks
                     $('#updateSitterSkillsButton').prop('disabled', true);
                    gapi.client.sitterProfileApi.updateSitterProfile($.extend({}, $scope.sitter, $rootScope.user.creds, {'signUpStep':$scope.steps[$scope.sitterDetails.currentStep].name})).execute(function(response){
                        console.log(response);
                        if (response.result && !response.error){
                            $scope.sitterDetails.currentStep++;
                            $scope.sitter.signUpStage = $scope.steps[$scope.sitterDetails.currentStep].name;
                            //$scope.sitterDetails.step=$scope.sitter.signUpStage;
                            //in case of successful update and switch to the next step - enable "next" button
                            $('#updateSitterSkillsButton').prop('disabled', false);
                            hj('vpv', '/sign-up/' + $scope.sitterDetails.currentStep);

                            //if signup is completed redirect to sitter profile page
                            if($scope.sitter.signUpStage==="COMPLETED"){
                                //set timeout to see how progress bar runs to 100%
                                timer = $timeout(function(){
                                    //before redirecting empty sitter object in saveStateService.
                                    //so that if a user returns from sitter profile to signup,
                                    //he would see the zero step of signup
                                    saveStateService.empty();
                                    $location.path('/sitter-profile/'+$rootScope.lang);

                                },1500);
                            }

                            $scope.$apply();
                            $window.scrollTo(0,0);
                        }
                        else
                        {
                            alertsService.showAlert(response.error.message);
                            $('#updateSitterSkillsButton').prop('disabled', false);

                        }
                    });
                };

                $scope.skipSignup = function(){
                    $scope.sitterDetails.skip = true;
                };

                $scope.$on("$destroy", function() {
                    if( timer )
                        $timeout.cancel( timer );
                    $rootScope.accountType = null;
                });
			}]
		};
	}]);

	signup.directive("parentDetails", ["alertsService", "authenticationService", "$location", function(alertsService, authenticationService, $location){
		return{
			restrict:'E',
			templateUrl: "partials/parent-details.html",
			controller: ["$scope", "$rootScope", function($scope, $rootScope){
			    $scope.createParentProfile = function()
			    {
			        $scope.$watch("parent_api_ready", function(){
                        $('#getStartedParentButton').prop('disabled', true);
                        if($rootScope.user.creds.tokenType === "FACEBOOK")
                        {
                            $scope.parent.signedToNewsletter = true;
                            $.extend($scope.parent, $rootScope.user.creds);
                            gapi.client.parentProfileApi.updateParentProfile($scope.parent).execute(function(response){
                                if (response.result && !response.error){
                                    console.log(response);
                                    //update first and last names in the rootscope and in cookies in case they were changed (from those that were received from fb)
                                    authenticationService.updateNames(response.firstNameEn, response.lastNameEn, response.firstNameHe, response.lastNameHe);
                                    $scope.completeParentProfile(response);
                                }
                                else{
                                    alertsService.showAlert(response.error.message);
                                    $('#getStartedParentButton').prop('disabled', false);
                                }
                            });
                        }
                        else
                        {
                            $.extend($scope.parent, {'agreedToTerms': true, 'signedToNewsletter': true});
                            $scope.$watch("parent_api_ready", function(){
                                if($scope.parent_api_ready === true) {
                                    if ($scope.parent.confirm === undefined) {
                                        authenticationService.requestEmailConfirmation($scope.parent.email, $rootScope.lang,
                                        function (response) {
                                              if (response.success) {
                                                    $scope.parentDetails.confirm = true;
                                                    $scope.$apply();
                                              } else {
                                                    alertsService.showAlert(response.error.message);
                                              }
                                        });

                                    }
                                    else {
                                        $.extend($scope.parent, {
                                            'accountId': $scope.parent.email,
                                            'token': $scope.parent.password,
                                            'tokenType': "SITE",
                                            'confirm': $scope.parent.confirm}
                                        );
                                        gapi.client.parentProfileApi.signUpParent($scope.parent).execute(function (response) {
                                            console.log(response);
                                             if (response.result && !response.error){
                                                $scope.setRootScope(response, "parent");
                                                $scope.completeParentProfile(response.result);
                                            }
                                            else{
                                                alertsService.showAlert(response.error.message);
                                                $('#getStartedParentButton').prop('disabled', false);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
			    };

			    $scope.completeParentProfile = function(parent)
                {
                     parent.signUpStage =  "COMPLETED";
                     //save updated state of the parent profile
                     gapi.client.parentProfileApi.updateParentProfile($.extend({}, parent, $rootScope.user.creds))
                                                     .execute(function(response){
                        if(response.result && !response.error){
                            $scope.parent = response.result;
                            //sent welcome email
                            gapi.client.accountSettingsApi.signupWelcome($.extend({}, {'accountType':"parent",
                               'language':$rootScope.lang}, $rootScope.user.creds)).execute(function (response) {
                                console.log(response);
                            });
                            $location.path('/parent-profile/' + $rootScope.lang);
                            $scope.$apply();
                        }
                        else{
                            $scope.completeParentProfile(parent);
                        }
                     });
                    return true;
                }

		    }]
        };
    }]);

})();
