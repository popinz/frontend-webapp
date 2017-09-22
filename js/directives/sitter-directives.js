(function(){
	var sitterDirectives = angular.module('sitterDirectives', ['publicEnumTypes', "translateModule"]);

    sitterDirectives.directive("contactDetails", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/contact-details.html",
            scope:{
                person: '=',
                mobileOnly: '@'
            },
            controller: ["$scope", function($scope){
                $scope.$on("validatePhone", function(event, prefix, suffix){
                    var additionalArgs=Array.prototype.slice.call(arguments).slice(3);
                    if(!prefix||!suffix)
                        $scope.$emit("validated", false, additionalArgs);
                    else
                        $scope.$emit("validated", true, additionalArgs);
                });
            }]
        }
    });

    sitterDirectives.directive("personalDetails", ["enumService", function(enumService){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/personal-details.html",
            controller: ["$scope", function($scope){
                $scope.genders = enumService.getEnum("Gender");
                $scope.$on("validateAge", function(event, age){
                    var additionalArgs=Array.prototype.slice.call(arguments).slice(2);
                    if(!age || age < 15)
                    {
                        $scope.ageInvalid = true;
                        $scope.$emit('validated', false, additionalArgs)
                    }
                    else
                    {
                        $scope.$emit('validated', true, additionalArgs)
                    }
                });
            }]
        }
    }]);

    sitterDirectives.directive("names", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/names.html",
            scope: {
                person: '=',
                lang: '='
            },
            controller: ["$scope", "$rootScope", function($scope, $rootScope)
            {
                $scope.$on('validateNames', function(event, firstNameEn, lastNameEn, firstNameHeb, lastNameHeb){
                    var additionalArgs=Array.prototype.slice.call(arguments).splice(5);
                    if(($rootScope.lang === 'en' && (!firstNameEn || !lastNameEn))||
                        ($rootScope.lang === 'he' && (!firstNameHeb || !lastNameHeb)))
                    {
                        $scope.$emit('validated', false, additionalArgs);
                    }
                    else
                    {
                        $scope.$emit('validated', true, additionalArgs)
                    }
                });
            }]
        }
    });

    sitterDirectives.directive("location", ["enumService", 'translateService', function(enumService, translateService){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/location.html",
            scope:{
                person: '=',
                locationRequired: '@',
                hideCityHeader: '@'
            },
            /*link:function(scope) {
                if(scope.person.city)
                    scope.checkNeighborhood();
            },*/
            controller: ["$scope", "$rootScope", function($scope, $rootScope){
                $scope.cities = enumService.getEnumCopy("City");
                for(key in $scope.cities){
                    $scope.cities[key].text = translateService.getEnumName($scope.cities[key], $rootScope.lang);
                }
                $scope.$watch("person.city", function(event){
                    if($scope.person){
                        if($scope.person.city)
                            $scope.checkNeighborhood();
                        else{
                            $scope.person.neighborhood = null;
                            $scope.neighborhoods = null
                        }
                    }
                });
                $scope.checkNeighborhood = function(){
                    $scope.neighborhoods = enumService.getPropertyOfSingleEnum("City", $scope.person.city, "insideNeighborhoods");
                    for(key in $scope.neighborhoods){
                        $scope.neighborhoods[key].text = translateService.getEnumName($scope.neighborhoods[key], $rootScope.lang);
                    }
                    if($scope.neighborhoods === null)
                        $scope.person.neighborhood = null;
                };
            }]
        }
    }]);

	sitterDirectives.directive("aboutMe", [function(){
    	return{
    		restrict:'E',
    		templateUrl: "partials/directives/about-me.html",
    		controller: ["$scope", "$rootScope", function($scope, $rootScope){
    		    //minimal length of long texts
    		    $scope.textareaMinLength = 50;

    		    //validates aboutMe text,
    		    //publishes "validated" event with result of validation passed as a second parameter
    		    $scope.$on('validateAboutMe', function(event, aboutMeEn, aboutMeHeb){
    		        //separates unnamed arguments that will be used for further validations
                    var additionalArgs=Array.prototype.slice.call(arguments).splice(3);
                    if($rootScope.lang === 'en' && aboutMeEn && aboutMeEn.length >= $scope.textareaMinLength)
                    {
                        $scope.$emit('validated', true, additionalArgs);
                    }
                    else if($rootScope.lang === 'he' && aboutMeHeb && aboutMeHeb.length >=$scope.textareaMinLength)
                    {
                        $scope.$emit('validated', true, additionalArgs);
                    }
                    else
                    {
                        //if invalid, triggers "invalid text" alert
                         $scope.aboutMeInvalid = true;
                         $scope.$emit('validated', false, additionalArgs);
                    }
                });
    		}]
    	};
    }]);

    sitterDirectives.directive("experienceText", ["$window", function($window){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/experience-text.html",
            controller: ["$scope", "$rootScope", function($scope, $rootScope){
                //minimal length of long texts
                $scope.textareaMinLength = 50;

                //validates experience text,
                //publishes "validated" event with result of validation passed as a second parameter
                $scope.$on("validateExperienceText", function(event, experienceStringEn, experienceStringHeb){
                    //separates unnamed arguments that will be used for further validations
                    var additionalArgs=Array.prototype.slice.call(arguments).splice(3);
                    if($rootScope.lang === 'en' && experienceStringEn && experienceStringEn.length>=$scope.textareaMinLength)
                    {
                        $scope.$emit("validated", true, additionalArgs);
                    }
                    else if($rootScope.lang === 'he' && experienceStringHeb && experienceStringHeb.length>=$scope.textareaMinLength)
                        $scope.$emit("validated", true, additionalArgs);
                    else
                    {
                        //if invalid, triggers "invalid text" alert
                        $scope.experienceInvalid = true;
                        $window.scrollTo($("#experienceAlert").offset().top, 0);
                        $scope.$emit("validated", false, additionalArgs);
                    }
                });
            }]
        }
    }]);

    sitterDirectives.directive("offeringsCheck", ["enumService", function(enumService){
        return{
            restrict: 'E',
            templateUrl: 'partials/directives/offerings-check.html',
            controller: ["$scope", function($scope){
                $scope.offerings = enumService.getEnumCopy("Offerings");
                $scope.homeworkHelps = enumService.getEnumCopy("HomeworkHelp");
                //listens to 'getOfferings' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of offerings
                //with the sitter's offerings prechecked
                $scope.$on("sitter", function(){
                    if($scope.sitter && $scope.sitter.offerings){
                         $scope.offerings = enumService.getCheckedEnumsFromSitter($scope.offerings, $scope.sitter.offerings);
                         if($scope.sitter.offerings && $scope.sitter.offerings.length>0)
                         {
                            for(var i = 0; i<$scope.sitter.offerings.length; i++){
                                if($scope.sitter.offerings[i] === "HOMEWORK_HELP"){
                                    $scope.toShowHomeworkHelp = true;
                                    break;
                                }
                            }
                         }
                     }
                });
                //listens to 'getHomeworkHelp' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of homeworkHelps
                //with the sitter's homeworkHelps prechecked
                $scope.$watch("sitter", function(){
                    if($scope.sitter && $scope.sitter.homeworkHelp)
                        $scope.homeworkHelps = enumService.getCheckedEnumsFromSitter($scope.homeworkHelps, $scope.sitter.homeworkHelp);
                });
                //listens to "gatherOfferings" event that comes from a parent
                $scope.$on("gatherOfferings", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gathers names of checked enums
                    $scope.gatheredOfferings = enumService.gatherCheckedEnumNames($scope.offerings);
                });
                $scope.$on("gatherHomeworkHelp", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gathers names of checked enums
                    $scope.gatheredHomeworkHelps = enumService.gatherCheckedEnumNames($scope.homeworkHelps);
                });

                //listens to changes of $scope.gatheredOfferings variable
                $scope.$watch("gatheredOfferings", function(){
                    //publishes "gathered" event when the variable changes
                    if($scope.gatheredOfferings !== undefined)
                        $scope.$emit("gathered", "offerings", $scope.gatheredOfferings, $scope.additionalArgs);
                });

                //listens to changes of $scope.gatheredHomeworkHelps variable
                $scope.$watch("gatheredHomeworkHelps", function(){
                    if($scope.gatheredHomeworkHelps !== undefined)
                        $scope.$emit("gathered", "homeworkHelps", $scope.gatheredHomeworkHelps, $scope.additionalArgs);
                });

                //called when any offering checkbox is checked
                //if "Homework help" checkbox checked,
                //"toShowHomeworkHelp" variable set to true and additional set of checkboxes is shown
                $scope.showHomeworkHelp = function(offering){
                    if(offering.name === "HOMEWORK_HELP"){
                        if(offering.checked)
                            $scope.toShowHomeworkHelp = true;
                        else{
                            $scope.toShowHomeworkHelp = false;
                            //uncheck subset of homework helps if parent checkbox is unchecked
                            $scope.homeworkHelps = enumService.getEnumCopy("HomeworkHelp");
                        }

                    }
                };
            }]
        }
    }]);

    sitterDirectives.directive("skillsCheck",["enumService", function(enumService){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/skills-check.html",
            controller: ["$scope", function($scope){
                $scope.skills = enumService.getEnumCopy("Skills");
                $scope.firstAids = enumService.getEnumCopy("FirstAid");
                $scope.sitter.firstAid = [];
                //listens to 'getSkills' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of skills
                //with the sitter's skills prechecked
                $scope.$watch("sitter", function(){
                    if($scope.sitter && $scope.sitter.skills){
                         $scope.skills = enumService.getCheckedEnumsFromSitter($scope.skills, $scope.sitter.skills);
                         //if there're any skills, check for "first aid"
                         //to show or not a subset of first ais checkboxes
                         if($scope.sitter.skills && $scope.sitter.skills.length>0)
                         {
                            for(var i = 0; i<$scope.sitter.skills.length; i++){
                                if($scope.sitter.skills[i] === "FIRST_AID_TRAINING"){
                                    $scope.toShowFirstAids = true;
                                    {break;}
                                }
                            }
                         }
                         if(!$scope.sitter.firstAid)
                            $scope.sitter.firstAid = [];
                     }
                });

                //listens to "gatherSkills" event that comes from a parent
                $scope.$on("gatherSkills", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gathers names of checked enums
                    $scope.gatheredSkills = enumService.gatherCheckedEnumNames($scope.skills);
                });

                //listens to changes of $scope.gatheredSkills variable
                $scope.$watch("gatheredSkills", function(){
                    //publishes "gathered" event when the variable changes
                    if($scope.gatheredSkills !== undefined)
                        $scope.$emit("gathered", "skills", $scope.gatheredSkills, $scope.additionalArgs);
                });

                //called when any skill checkbox is checked
                //if "First aid" checkbox checked,
                //"toShowFirstAids" variable set to true and additional set of checkboxes is shown
                $scope.showFirstAids = function(skill){
                    if(skill.name === "FIRST_AID_TRAINING"){
                        if(skill.checked)
                            $scope.toShowFirstAids = true;
                        else{
                            $scope.toShowFirstAids = false;
                            //uncheck subset of firstAids if parent checkbox isunchecked
                            $scope.sitter.firstAid =[];

                        }
                    }
                };
            }]
        }
    }]);

    sitterDirectives.directive("experienceCheck", ["enumService", function(enumService){
        return{
            restrict: 'E',
            templateUrl: 'partials/directives/experience-check.html',
            controller: ["$scope", function($scope){
                $scope.experiences = enumService.getEnumCopy("Experience");
                //listens to 'getExperience' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of experiences
                //with the sitter's experinces prechecked
                $scope.$watch("sitter", function(){
                    if($scope.sitter && $scope.sitter.experience)
                        $scope.experiences = enumService.getCheckedEnumsFromSitter($scope.experiences, $scope.sitter.experience);
                });
                //listens to "gatherExperiences" event that comes from a parent
                $scope.$on("gatherExperiences", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gathers names of checked enums
                    $scope.gatheredExperiences = enumService.gatherCheckedEnumNames($scope.experiences);
                });
                //listens to changes of $scope.gatheredExperiences variable
                $scope.$watch("gatheredExperiences", function(){
                    //publishes "gathered" event when the variable changes
                    if($scope.gatheredExperiences !== undefined)
                        $scope.$emit("gathered", "experiences", $scope.gatheredExperiences, $scope.additionalArgs);
                });
            }]
        }
    }]);
})();