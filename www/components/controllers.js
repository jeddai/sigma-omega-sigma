angular.module('sigmaomegasigma.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {
    'username' : '',
    'password' : ''
  };

  $scope.loggedIn = false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('components/menu/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    auth.signOut()
    .then(function() {
      var error;
      auth.signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password).catch(function(fireError) {
        // Handle Errors here.
        error = fireError;
        console.log('Invalid login ' + error);
        $scope.loggedIn = false;
        $scope.closeLogin();
        return;
      });
      if(!error) {
        $scope.loggedIn = true;
        $scope.closeLogin();
      }
    }, function(error) {
      console.log('Unable to log out user in order to log in');
    });
  };

  $scope.logout = function() {
    auth.signOut()
    .then(function() {
      console.log('User has been logged out.');
      $scope.loggedIn = false;

      auth.signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
      });
    }, function(error) {
      console.log('Unable to log out user');
    });
  };
})

.controller('MembersCtrl', function($scope, $ionicModal, $ionicTabsDelegate) {
  $scope.members = [];
  $scope.activeMember = {};

  $scope.show = {
    'sir_name' : {
      'text' : 'Sir Name',
      'value' : true,
      'show' : true
    },
    'position' : {
      'text' : 'Position',
      'value' : true,
      'show' : true
    },
    'email' : {
      'text' : 'Email Address',
      'value' : false,
      'show' : true
    },
    'phone' : {
      'text' : 'Phone Number',
      'value' : false,
      'show' : false
    },
    'status' : {
      'text' : 'Status',
      'value' : false,
      'show' : true
    }
  };

  $scope.$watch(function($scope) {
    return $scope.loggedIn;
  }, function() {
    if($scope.loggedIn) {
      $scope.show.phone.show = true;
    }else {
      $scope.show.phone.show = false;
      $scope.show.phone.value = false;
    }
  }, true);

  $scope.memberTypes = {
    'active' : {
      'text': 'Active',
      'value': 'active',
      'show': true
    },
    'inactive' : {
      'text': 'Inactive',
      'value': 'inactive',
      'show': false
    },
    'alumni' : {
      'text': 'Alumni',
      'value': 'alumni',
      'show': false
    },
    'sponsor' : {
      'text': 'Sponsor',
      'value': 'sponsor',
      'show': false
    }
  };

  $scope.showStatus = function(status) {
    return $scope.memberTypes[status].text;
  };

  firebase.database().ref('members/').on('value', function(snapshot) {
    $scope.members = snapshot.val();
    console.log(snapshot.val());
  });

  $scope.active = function(member) {
    if($scope.data.value == member.status) {
      return true;
    }else {
      return false;
    }
  };

  $ionicModal.fromTemplateUrl('components/members/member-info-view.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.memberInfoModal = modal;
  });

  $scope.openInfoView = function(member) {
    $scope.activeMember = member;
    $scope.memberInfoModal.show();
  };

  $scope.closeInfoModal = function() {
    $scope.activeMember = {};
    $scope.memberInfoModal.hide();
  };

  $ionicModal.fromTemplateUrl('components/members/memberFilter.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.chooseModal = modal;
  });

  $scope.openChooseView = function() {
    $scope.chooseModal.show();
  };

  $scope.closeChooseModal = function() {
    $scope.chooseModal.hide();
  };
})

.controller('AboutCtrl', function($scope) {

});
