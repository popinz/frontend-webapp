(function(){
    var sitterProfile = angular.module('sitterProfile', ['ngRoute', 'availabilityCalendar', 'publicEnumTypes', 'sitterDirectives', 'jobDirectives', 'alertsModule', 'authenticationModule', 'saveFiltersModule', "contactSitter"])

    .controller('sitterProfileCtrl', ["$scope", '$rootScope', '$routeParams', '$location', "alertsService", 'authenticationService', "$window", "saveFiltersService", "$timeout", function($scope, $rootScope, $routeParams, $location, alertsService, authenticationService, $window, saveFiltersService, $timeout){
        $scope.setPageLanguage($routeParams.langId);
        $scope.sitter = {};
        $scope.view = false;
        $scope.edit = false;
        $scope.sitter_loaded = false;
        var search = Object.keys($location.search())[0];
        //unregistered user redirected to login page
        $scope.$watchGroup(["parent_api_ready", "sitter_api_ready", 'sitter_search_api_ready'], function(){
            if($scope.parent_api_ready === true && $scope.sitter_api_ready === true && $scope.sitter_search_api_ready === true){
                //if user is not logged in
                var sitterToShow = saveFiltersService.getSitter();
                var path = $location.path();
                if($rootScope.user.creds === undefined || angular.equals({}, $rootScope.user.creds.accountId))
                {
                    if(!search)
                        $location.path('/main');
                    else
                        $location.path('/sitters/'+$rootScope.lang);
                }
                //if user id logged in and we are redirected from the browse sitters page
                else if(sitterToShow){
                    $scope.sitter = sitterToShow;
                    $scope.sitter_loaded = true;
                    $scope.view = true;
                    saveFiltersService.deleteSitter();
                    //check if the current language profile complete
                    //if not, display an alert
                    $scope.displayViewAlert = $scope.testForLangAlert($scope.sitter);
                    $window.scrollTo(0, 0);
                }
                //no search part in URL, that means that we're viewing our one profile
                //that means we can't give a link to our own profile
                //do we need it?
                else if(!search)
                {
                    if($rootScope.user.userType === "sitter"){
                        if(path.startsWith("/sitter")){
                            gapi.client.sitterProfileApi.getSitterProfile($rootScope.user.creds).execute(
                                function (response) {
                                    console.log(response);
                                    if (response.result && !response.error){
                                        //profile could be seen only by those who completed there signup procedure
                                        if(response.result.signUpStage === "COMPLETED" || response.result.signUpStage ==="EIGHTH"){
                                            $scope.edit = {'areas' : false, 'experienceText' : false, 'aboutMe' : false, 'contactInfo' : false, "mainInfo" : false,
                                                            'offeringsIcons':false, 'calendar':false};
                                            $scope.cardOpen = 'none';
                                            $scope.sitter = response;
                                            $scope.sitter_loaded = true;
                                            $rootScope.user.profileReady = true;
                                            //check if the current language profile complete
                                            //if not, display an alert
                                            $scope.displayAlert = $scope.testForLangAlert($scope.sitter);
                                            //if it's the first visit to sitter profile, conratulations window appears
                                            if(response.result.signUpStage ==="EIGHTH")
                                                $('#congratulationModal').modal();
                                            $scope.$apply();
                                        }
                                        else {
                                            $location.path('/signup/' + $rootScope.lang);
                                            $scope.$apply();
                                        }
                                    }
                                    else{
                                        alertsService.showAlert(response.error.message);
                                    }
                                }
                            );
                        }
                        else{
                            $location.path("/sitter-profile/" + $rootScope.lang);
                        }
                    }
                    else if($rootScope.user.userType === "parent"){
                        if(path.startsWith("/parent")){
                            gapi.client.parentProfileApi.getParentProfile($rootScope.user.creds).execute(
                                function(response){
                                    if(response.result && !response.error){
                                        $scope.parent = response.result;
                                        if(!$scope.parent.secondEmail)
                                            $scope.parent.secondEmail = $scope.parent.email;
                                        $scope.edit = { 'requirements' : false, 'aboutUs' : false, "mainInfoPr" : false, "contactInfoPr" : false };
                                        $scope.cardOpen = 'none';
                                        $scope.parent_loaded = true;
                                        $scope.$apply();
                                    }
                                }
                            );
                        }
                        else{
                            $location.path("/parent-profile/" + $rootScope.lang);
                        }
                    }
                }
                else if(search)
                {
                    if(path.startsWith("/sitter")){
                        var searchInstance = $.extend({}, $rootScope.user.creds, {'id':search});
                        gapi.client.sitterProfileApi.getSitterProfileById(searchInstance).execute(
                        function (response) {
                            if (response.result && !response.error){
                                $scope.sitter = response.result;
                                $scope.view = true;
                                $scope.sitter_loaded = true;
                                //check if the current language profile complete
                                //if not, display an alert
                                $scope.displayViewAlert = $scope.testForLangAlert($scope.sitter);
                                $scope.$apply();
                            }
                            else{
                                alertsService.showAlert(response.error.message);
                            }
                        });
                    }
                    else{
                        $location.path("/parent-profile/" + $rootScope.lang).search("");
                    }
                }
            }
        });

        $scope.showContactBtn = function(){
            if($scope.view && $rootScope.user.userType === 'parent')
                return true;
            else
                return false;
        }
        //check sitter profile for language specific fields
        $scope.testForLangAlert = function(sitter){
            var alert = false;
            if($scope.showNameAlert(sitter) || $scope.showAboutMeAlert(sitter) || $scope.showExperienceAlert(sitter))
                alert = true;
            return alert;
        }



        $scope.showNameAlert = function(sitter){
            if(!sitter || ($rootScope.lang === 'en' && sitter.firstNameEn && sitter.lastNameEn) ||
                       ($rootScope.lang === 'he' && sitter.firstNameHe && sitter.lastNameHe))
                return false;
            return true;
        }

        $scope.showAboutMeAlert = function(sitter){
            if(!sitter)
                return false;
            if(($rootScope.lang === 'en' && sitter.aboutMeEn) || ($rootScope.lang === 'he' && sitter.aboutMeHeb))
                return false;
            if($scope.view && !sitter.aboutMeEn && !sitter.aboutMeHeb)
                return false;
            return true;
        }

        $scope.showExperienceAlert = function(sitter){
           if(!sitter)
                return false;
            if(($rootScope.lang === 'en' && sitter.experienceStringEn) || ($rootScope.lang === 'he' && sitter.experienceStringHeb))
                return false;
            if($scope.view && !sitter.experienceStringEn && !sitter.experienceStringHeb)
                return false;
            return true;
        }

        //sets signup stage to COMPLETED and saves the update;
        //called on congratulations window button click
        $scope.complete = function(){
            $scope.sitter.signUpStage = "COMPLETED";
            gapi.client.sitterProfileApi.updateSitterProfile($.extend({}, $scope.sitter, $rootScope.user.creds)).execute(
                function (response) {
                    console.log(response);
                    if (response.error) {
                        alertsService.showAlert(response.error.message);
                    }
                    else {
                        var welcome = {};
                        if($rootScope.user.creds.tokenType === "FACEBOOK") {
                            $.extend(welcome, $rootScope.user.creds, {'accountType':"sitter", 'language':$rootScope.lang});
                        }
                        else {
                            $.extend(welcome, {
                               'accountId': $scope.sitter.email,
                               'token': $rootScope.user.creds.token,
                               'tokenType': $rootScope.user.creds.tokenType,
                               'language':$rootScope.lang,
                               'accountType':"sitter"
                            });
                        }
                        gapi.client.accountSettingsApi.signupWelcome(welcome).execute(function (response) {
                            console.log(response);
                        });
                    }
                });
        }

        $scope.editMode = function(cardId)
        {
            //switches between "editing" and "saved" mode
            //picture on save button switches accordingly between (floppy disk and pencil)
            $scope.edit[cardId] = !$scope.edit[cardId];
            if($scope.edit[cardId])
                $scope.cardOpen=cardId;
            else
                $scope.cardOpen='none';
            if(!$scope.edit[cardId])
            {
                //chooses fields to be validated depending on what card we're editing
                //publishes "validate" events
                switch(cardId){
                    case "areas":
                        //$scope.sitter.neighborhoodsWork = sitterProfileService.getUpdatedNeighborhoods($scope.checkedNeighborhoods);
                        //$scope.sitter.whereOutside = sitterProfileService.getUpdatedCities($scope.checkedCities);
                        $scope.$broadcast("gatherCities", "gatherNeighborhoods", "areas");
                        break;
                    case "contactInfo":
                        $scope.$broadcast("validatePhone", $scope.sitter.phoneNumberPrefix, $scope.sitter.phoneNumberSuffix, "contactInfo");
                        break;
                    case "aboutMe":
                        $scope.$broadcast("validateAboutMe", $scope.sitter.aboutMeEn, $scope.sitter.aboutMeHeb, "aboutMe");
                        break;
                    case "experienceText":
                        $scope.$broadcast("validateExperienceText", $scope.sitter.experienceStringEn, $scope.sitter.experienceStringHeb, "experienceText");
                        break;
                    case "mainInfo":
                        $scope.$broadcast("validateAge", $scope.sitter.age, "validateNames", $scope.sitter.firstNameEn, $scope.sitter.lastNameEn, $scope.sitter.firstNameHe, $scope.sitter.lastNameHe, "gatherJobTypes", "gatherSkills", "gatherLanguages", "mainInfo");
                        break;
                    case "offeringsIcons":
                        $scope.$broadcast("gatherExperiences", "gatherOfferings", "gatherHomeworkHelp", "offeringsIcons");
                        break;
                    case "calendar":
                        $scope.$broadcast("gatherScheduleUpdate", "calendar");
                        break;
                    //if no validation needed, calls saveUpdate()
                    default:
                        $scope.saveUpdate(cardId);
                        break;
                }
            }
        }

        //listens to "gathered" event that comes from a child
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
                    $scope.sitter.whereOutside = res;
                    break;
                case "neighborhoods":
                    $scope.sitter.neighborhoodsWork = res;
                    break;
                case "languages":
                    $scope.sitter.languages = res;
                    break;
                default:
                    break;
            }
            $scope.repeatOrSave(additionalArgs);
        });

        //listens to "validated" event coming from a child
        $scope.$on("validated", function(event, res, additionalArgs){
            $scope.cardId = additionalArgs[additionalArgs.length-1];
            if(!res)
            {
                $scope.edit[$scope.cardId] = !$scope.edit[$scope.cardId];
                $scope.cardOpen = cardId;
            }
            else
            {
                if($scope.cardId === "mainInfo" || $scope.cardId === 'aboutMe' || $scope.cardId === 'experienceText')
                {
                    $scope.displayAlert= $scope.testForLangAlert($scope.sitter);
                    if($scope.cardId === "mainInfo")
                        //update names in rootScope and cookies in case the names were changed
                        authenticationService.updateNames($scope.sitter.firstNameEn, $scope.sitter.lastNameEn, $scope.sitter.firstNameHe, $scope.sitter.lastNameHe);
                }

                $scope.repeatOrSave(additionalArgs);
            }
        });

        //analyzes array of additional arguments to find out
        //whether another validation/gathering cycle is needed
        //or we can save the update
        $scope.repeatOrSave = function(additionalArgs){
            if(additionalArgs.length>1)
            {
                 $scope.$broadcast.apply($scope, additionalArgs);
            }
            else
            {
                 $scope.saveUpdate($scope.cardId);
            }
        }
        $scope.resizeImage = function(){
            $scope.$broadcast("resizeImage");
        };

        $scope.$on("imageReady", function(e, validationRes, res){
            if(validationRes){
                $scope.sitter.img = res;
                $('#photoModal').modal("hide");
            }
        });

        $scope.saveUpdate = function(cardId)
        {
            if($rootScope.user.userType === "sitter"){
                gapi.client.sitterProfileApi.updateSitterProfile($.extend({}, $scope.sitter, $rootScope.user.creds)).execute(function(response){
                    if(response.result && !response.error){
                        if(cardId==="mainInfo")
                            authenticationService.updateNames(response.result.firstNameEn, response.result.lastNameEn,
                                response.result.firstNameHe, response.result.lastNameHe);
                        $scope.$apply();
                    }
                    else{
                        $scope.edit[cardId] = !$scope.edit[cardId];
                        alertsService.showAlert(response.error.message);
                    }

                });
            }
            else if($rootScope.user.userType === "parent"){
                gapi.client.parentProfileApi.updateParentProfile($.extend({}, $scope.parent, $rootScope.user.creds)).execute(function(response){
                    if(response.result && !response.error){
                        if(cardId==="mainInfoPr")
                            authenticationService.updateNames(response.result.firstNameEn, response.result.lastNameEn,
                                response.result.firstNameHe, response.result.lastNameHe);
                        $scope.$apply();
                    }
                    else{
                        $scope.edit[cardId] = !$scope.edit[cardId];
                        alertsService.showAlert(response.error.message);
                    }

                });
            }
        }
    }]);
})();