(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('AboutCtrl', AboutController);

  function AboutController($state) {
    var self = this;
    self.welcome = "Welcome to the Sigma Omega Sigma app! We created this app to help people keep connected with our club. If you are at all interested in receiving updates from us regarding pledging events and other events, please subscribe to the push notification topics found in the settings tab!";

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
      settings : {
        'name' : 'Settings',
        'link' : 'app.settings',
        'blurb' : '',
        'icon' : 'icon ion-ios-gear energized about-icon'
      }
    };
  }
})();
