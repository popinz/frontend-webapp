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
    var langs = angular.module("langCheck", ['publicEnumTypes', 'translateModule']);
    langs.service("langsService", ["$rootScope", "enumService", function($rootScope, enumService){
        this.getLanguages = function(){
            var langs = enumService.getEnumCopy("Language");
            for(var i = 0; i < langs.length; i++)
            {
                if(langs[i].code === $rootScope.lang)
                {
                    langs[i].checked = true;
                    {break;}
                }
            }
            return langs;
        };
    }]);
    langs.directive("langCheck", ["enumService", "langsService", function(enumService, langsService){
        return{
            restrict: 'E',
            templateUrl: 'partials/directives/languages.html',
            controller: ["$scope", "$rootScope", "translateFilter", function($scope, $rootScope, translateFilter){

                //receives arrays of languages with current language prechecked
                $scope.languages = langsService.getLanguages();

                //listens to 'getLanguages' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of languages
                //with the sitter's languages prechecked
                $scope.$watch("sitter", function(){
                    if($scope.sitter && $scope.sitter.language){
                        $scope.languages = enumService.getCheckedEnumsFromSitter($scope.languages, $scope.sitter.languages);
                        var anotherProfileLang;
                        switch($rootScope.lang){
                            case 'en':
                            anotherProfileLang = 'he';
                            break;
                            case 'he':
                            anotherProfileLang = 'en'
                            break;
                        }
                        //find out whether "another language" is already added to the array of sitter languages.
                        //if yes, show  "create / edit another language profile" part
                        for(var i = 0; i<$scope.languages.length; i++){
                            if($scope.languages[i].code === anotherProfileLang && $scope.languages[i].checked){
                                $scope.toShowAnotherlanguageProfile = true;
                                $scope.checkedLanguage = $scope.languages[i];
                                // check if another language profile is already created
                                //if yes, show "edit" button instaed of "create"
                                console.log($scope.checkedLanguage);
                                console.log($scope.sitter.firstNameHe);
                                if($scope.checkedLanguage.code === 'he' && $scope.sitter.firstNameHe ||
                                    $scope.checkedLanguage.code === 'en' && $scope.sitter.firstNameEn)
                                        $scope.anotherLanguageProfileCreated = true;
                                console.log($scope.anotherLanguageProfileCreated);
                                break;
                            }
                        }
                    }
                });

                //listens to gatherLanguages event coming from parent
                $scope.$on("gatherLanguages", function(e){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gather names of checked checkboxes
                    $scope.checkedLanguages = enumService.gatherCheckedEnumNames($scope.languages);
                });

                $scope.$watch("checkedLanguages", function(){
                    if($scope.checkedLanguages !== undefined)
                        $scope.$emit("gathered", "languages", $scope.checkedLanguages, $scope.additionalArgs);
                });

                $scope.showAnotherlanguageProfile = function(lang)
                {
                    if(lang.checked && $rootScope.lang !== lang.code && lang.code !== '')
                    {
                        $scope.toShowAnotherlanguageProfile = true;
                        $scope.checkedLanguage = lang;
                    }
                    else if(!lang.checked && $scope.checkedLanguage && lang.code == $scope.checkedLanguage.code)
                    {
                        $scope.toShowAnotherlanguageProfile = false;
                        $scope.checkedLanguage={};
                    }
                }

                $scope.profileCreated = function(){
                    console.log($scope.sitter);
                    $scope.textareaMinLength = 50;
                    if(($scope.sitter.aboutMeHeb.length >= $scope.textareaMinLength && $scope.sitter.aboutMeEn.length < $scope.textareaMinLength) ||
                            ($scope.sitter.aboutMeEn.length >= $scope.textareaMinLength && $scope.sitter.aboutMeHeb.length < $scope.textareaMinLength))
                    {
                        $scope.aboutMe2Invalid = true;

                        $('#content').animate({
                               scrollTop: $("#aboutMeAlert").offset().top
                        }, 500);
                        return;
                    }
                    if(($scope.sitter.experienceStringHeb.length >= $scope.textareaMinLength && $scope.sitter.experienceStringEn.length < $scope.textareaMinLength) ||
                            ($scope.sitter.experienceStringEn.length >= $scope.textareaMinLength && $scope.sitter.experienceStringHeb.length < $scope.textareaMinLength))
                    {
                      $scope.experience2Invalid = true;
                      return;
                    }
                    $scope.anotherLanguageProfileCreated = true;
                    $('#hebrewProfileModal').modal("hide");
                }

                $scope.cancel = function(){
                    if($rootScope.lang === 'en')
                    {
                        $scope.sitter.aboutMeHeb = '';
                        $scope.sitter.experienceStringHeb = '';
                        $scope.sitter.firstNameHeb = '';
                        $scope.sitter.lastNameHeb = '';
                    }
                    else if($rootScope.lang = 'he')
                    {
                        $scope.sitter.aboutMeEn = '';
                        $scope.sitter.experienceStringEn = '';
                        $scope.sitter.firstNameEn = '';
                        $scope.sitter.lastNameEn = '';
                    }
                }
            }]
        };
    }]);
})();