(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .factory('FirebaseFactory', FirebaseFactory);

  function FirebaseFactory() {
    return {
      getItems : getItems
    };

    function getItems(place) {
      return firebase.database().ref(place);
    }
  }
})();
