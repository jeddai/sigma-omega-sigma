(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .service('UserService', UserService);

  function UserService($cordovaSQLite, $ionicPlatform, FirebaseFactory, SlackFactory) {
    var service = this;

    $ionicPlatform.ready(function () {
      service.db = $cordovaSQLite.openDB({name: 'sos.db', location: 'default'});
    });

    service.loggedIn = '';
    service.uid = '';
    service.fcmToken = '';
    service.admins = [];
    service.setLoggedIn = setLoggedIn;
    service.retrieveLoginData = retrieveLoginData;

    function setLoggedIn(value) {
      service.loggedIn = value;
      if(value) {
        var user = auth.currentUser;
        if(!!user) {
          service.uid = user.uid;
        }
        storeLoginData();
      } else {
        service.uid = '';
        deleteLoginData();
      }
      return value;
    }

    function retrieveLoginData() {
      console.log('getting login info');
      service.db.executeSql('SELECT value FROM userdata WHERE key = ? or key = ?', ['timestamp', 'uid'], function (resultSet) {
        var d = new Date();
        d.setDate(d.getDate() - 5);
        JSON.stringify(resultSet.rows);
        var ts = resultSet.rows.item(0);
        service.uid = resultSet.rows.item(1).value;
        if(d.getTime() < ts.value && !!service.uid) {
          console.log('login valid ' + JSON.stringify(ts));
          return service.setLoggedIn(true);
        } else {
          console.log('login invalid' + JSON.stringify(ts));
          return service.setLoggedIn(false);
        }

      }, function (error) {
        console.log('Unable to retrieve user data');
        return false;
      });
    }

    function storeLoginData() {
      var ts = new Date().getTime();

      $cordovaSQLite.execute(service.db, 'CREATE TABLE IF NOT EXISTS userdata (key, value)');
      deleteLoginData();

      $cordovaSQLite.execute(service.db, 'INSERT INTO userdata VALUES(?,?)', ['timestamp', ts]).then(function(result) {
        console.log("INSERTED -> " + ts);
      }, function(error) {
        console.error(error);
      });

      $cordovaSQLite.execute(service.db, 'INSERT INTO userdata VALUES(?,?)', ['uid', service.uid]).then(function(result) {
        console.log("INSERTED -> " + JSON.stringify(service.uid));
      }, function(error) {
        console.error(error);
      });
    }

    function deleteLoginData() {
      $cordovaSQLite.execute(service.db, 'CREATE TABLE IF NOT EXISTS userdata (key, value)');
      $cordovaSQLite.execute(service.db, 'DELETE FROM userdata');
    }
  }
})();
