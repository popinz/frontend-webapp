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