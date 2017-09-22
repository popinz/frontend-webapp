(function(){
    'use strict';
    var saveFilters = angular.module("saveFiltersModule", []);
    saveFilters.service("saveFiltersService", function(){
        var self = this;
        var data;

        this.saveFilters = function(filters, results, searchInstance, sitter){
            data = {'filters' : filters, 'results' : results, 'searchInstance' : searchInstance, 'id' : sitter.id, 'clickedSitter' : sitter};
        };

        this.getFilters = function(){
            return data;
        };

        this.emptyFilters = function(){
            data = null;
        };

        this.deleteSitter = function(){
            data.clickedSitter = null;
        }

        this.getSitter = function(){
            if(data)
                return data.clickedSitter;
            else
                return null;
        }
    });
})();