(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('AboutCtrl', AboutController);

  function AboutController($scope, $state, $cordovaInAppBrowser, UserService) {
    var self = this;
    self.welcome = "Welcome to the Sigma Omega Sigma app! We created this app to help people keep connected with our club. If you are at all interested in receiving updates from us regarding pledging events and other events, please subscribe to the push notification topics found in the settings tab!";
    self.link = link;
    self.loggedIn = UserService.loggedIn;

    self.goTo = function(place) {
      $state.go(place);
    };

    self.links = {
      members : {
        'name' : 'Members',
        'link' : 'app.members',
        'blurb' : '',
        'icon' : 'icon ion-person-stalker energized about-icon'
      },
      service : {
        'name' : 'Service',
        'link' : 'app.service',
        'blurb' : '',
        'icon' : 'icon ion-earth energized about-icon'
      },
      pledging : {
        'name' : 'Pledging',
        'link' : 'app.pledging',
        'blurb' : '',
        'icon' : 'icon ion-person-add energized about-icon'
      },
      contact : {
        'name' : 'Contact',
        'link' : 'app.contact',
        'blurb' : '',
        'icon' : 'icon ion-email energized about-icon'
      },
      faith : {
        'name' : 'Faith',
        'link' : 'app.faith',
        'blurb' : '',
        'icon' : 'icon ion-heart energized about-icon'
      },
      settings : {
        'name' : 'Settings',
        'link' : 'app.settings',
        'blurb' : '',
        'icon' : 'icon ion-ios-gear energized about-icon'
      }
    };

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.loggedIn = value;
    }, true);

    function link(url, target) {
      $cordovaInAppBrowser.open(url, target);
    }
  }
})();
