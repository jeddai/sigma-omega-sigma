(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('ContactCtrl', ContactController);

  function ContactController($scope, $window, FirebaseFactory, $ionicLoading, $cordovaInAppBrowser) {
    var self = this;

    self.email = email;
    self.contacts = [];

    function loading(val) {
      if(val) {
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>'
        });
      } else {
        $ionicLoading.hide();
      }
    }

    function getContacts() {
      loading(true);
      FirebaseFactory.getItems('/contact').on('value', function(snapshot) {
        self.contacts = snapshot.val();
        loading(false);
      });
    }

    function email(email) {
      $cordovaInAppBrowser.open('mailto:' + email + '?subject=%5BSOS App%5D%20-%20Contact%20Page', '_system');
    }

    getContacts();
  }
})();
