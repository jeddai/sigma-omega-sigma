(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .service('UserService', UserService);

  function UserService() {
    var service = this;

    service.loggedIn = false;
    service.setLoggedIn = setLoggedIn;

    function setLoggedIn(value) {
      service.loggedIn = value;
      return value;
    }

  }
})();
