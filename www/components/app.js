angular.module('sigmaomegasigma', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    var config = {
      apiKey: "AIzaSyCoJNQeL1bNBshfKhWm44i7XvpfbUzVYmA",
      authDomain: "sigma-omega-sigma.firebaseapp.com",
      databaseURL: "https://sigma-omega-sigma.firebaseio.com",
      storageBucket: "sigma-omega-sigma.appspot.com",
    };

    if(window.FirebasePlugin) {
      window.FirebasePlugin.getInstanceId(function(token) {
          window.FirebasePlugin.grantPermission();
      }, function(error) {
          console.error(error);
      });
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'components/menu/menu.html',
    controller: 'AppCtrl',
    controllerAs: 'app'
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'components/about/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      }
    }
  })
  .state('app.service', {
    url: '/service',
    views: {
      'menuContent': {
        templateUrl: 'templates/service.html'
      }
    }
  })
  .state('app.members', {
    url: '/members',
    views: {
      'menuContent': {
        templateUrl: 'components/members/members.html',
        controller: 'MembersCtrl',
        controllerAs: 'members'
      }
    }
  })
  .state('app.pledging', {
    url: '/pledging',
    views: {
      'menuContent': {
        templateUrl: 'templates/pledging.html'
      }
    }
  })
  .state('app.contact', {
    url: '/contact',
    views: {
      'menuContent': {
        templateUrl: 'templates/contact.html'
      }
    }
  })
  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'components/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/about');
});
