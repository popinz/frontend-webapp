(function(){
    var headerDir = angular.module("headerDir", ["authenticationModule", "translateModule"]);

    headerDir.directive("headerAlpha", ["$location", "$timeout", "translateService", function($location, $timeout, translateService){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/header-alpha.html",
            controller: ["$scope", "$rootScope", function($scope, $rootScope){
                var langs = {};
                var inactiveLang = {};
                currentLangs.forEach(function(lang){
                        langs[lang.langCode]={"flagUrl":"images/flags/" + lang.flag + ".png", "langCode": lang.langCode};
                    }
                );

                $scope.showLangSelect = function(){
                    var url = $location.path();
                    if(url.startsWith("/signup/") && !$scope.credsEmpty())
                        return false;
                    return true;

                }

                $scope.credsEmpty = function(){
                    if(!$rootScope.user.creds || $rootScope.user.creds.accountId === undefined)
                        return true;
                    else
                        return angular.equals({}, $rootScope.user.creds.accountId);
                };
                $scope.switchTo = function(){
                    var url = $location.path().slice(0, $location.path().lastIndexOf('/')+1) + $scope.inactiveLang.langCode;
                    $location.path(url);
                }

                $scope.getFlagUrl = function(currentCode){
                    if(currentCode === 'en')
                        $scope.inactiveLang=langs["he"];
                    else
                        $scope.inactiveLang=langs["en"];
                    return $scope.inactiveLang.flagUrl;
                }

                $scope.getGreeting = function(lang)
                {
                    var greetings = {"en" : "Hello", "he" : "שלום"};
                    if($rootScope.user.userType === 'parent'){
                        if($rootScope.user.firstNames && $rootScope.user.lastNames){
                            if( $rootScope.user.firstNames[lang] && $rootScope.user.lastNames[lang] )
                                return greetings[lang] + " " + $rootScope.user.firstNames[lang] + " " + $rootScope.user.lastNames[lang];
                            else if ( lang === 'en' )
                                return greetings[lang] + " " + $rootScope.user.firstNames['he'] + " " + $rootScope.user.lastNames['he'];
                            else if( lang === 'he' )
                                return greetings[lang] + " " + $rootScope.user.firstNames['en'] + " " + $rootScope.user.lastNames['en'];
                        }
                    }

                    else if($rootScope.user.userType === "sitter"){
                        if($rootScope.user.profileReady)
                            return translateService.getTranslation("MY_PROFILE", $rootScope.lang);
                        else
                            return translateService.getTranslation("COMPLETE_IT", $rootScope.lang);
                    }
                    else
                        return "";
                }

                $scope.linkToProfile = function(){
                    var link = "";
                    if($rootScope.user.userType === "sitter"){
                        if($rootScope.user.profileReady)
                            link = "#/sitter-profile/"+$rootScope.lang;
                        else
                            link = "#/signup/"+$rootScope.lang;
                    }
                    return link;

                }
            }]
        }
    }]);
    headerDir.directive("footerAlpha", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/footer-members.html"
        }
    });
})();