
var app = angular.module('app', ['ngRoute', 'ngMessages', 'ngDialog']);

var access_key = "";

app.config(function($locationProvider, $location) {

    //Fix route issue
    $locationProvider.hashPrefix('');

    //Grab hash
    access_key = $location.hash();

});