(function() {
  'use strict';

  angular.module('sigmaomegasigma')
  .factory('SlackFactory', SlackFactory);

  function SlackFactory($http) {

    var username = 'SOS App Logs';
    var icon = 'http://app.sigmaomegasigma.com/sites/sos/files/icon.png';
    var slackAppLogs = 'https://hooks.slack.com/services/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';

    return {
      log : log,
      logAttachment : logAttachment,
      loginEvent : loginEvent,
      logoutEvent : logoutEvent,
      prayerRequestEvent : prayerRequestEvent,
      prayerRequestApprovedEvent : prayerRequestApprovedEvent
    };

    function log(event, channel) {
      webhook(generateJson(event, channel));
    }

    function logAttachment(event, channel, color, token) {
      webhook(generatePretextJson(event, channel, color, token));
    }

    function webhook(data) {
      $http({
        method : 'POST',
        url : slackAppLogs,
        data : JSON.stringify(data),
        headers : {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
        .success(function() {
          console.log('Logged event');
        })
        .error(function(data) {
          console.log('Error', data);
        });
    }

    function loginEvent(val) {
      if(val) {
        return 'User login valid';
      } else {
        return 'User login invalid';
      }
    }

    function logoutEvent(uid) {
      return 'User ' + uid + ' logged out';
    }

    function prayerRequestEvent(request) {
      return 'New prayer request submitted: ' + request;
    }

    function prayerRequestApprovedEvent(request, val) {
      if(val) {
        return 'Prayer request \"' + request.request + '\" has been approved';
      } else {
        return 'Prayer request \"' + request.request + '\" has been denied.';
      }
    }

    function generateJson(message, channel) {
      return {
        text : message,
        username : username,
        icon_url : icon,
        channel : channel
      }
    }

    function generatePretextJson(message, channel, color, token) {
      return {
        username : username,
        icon_url : icon,
        channel : channel,
        attachments : [{
          fallback : message + '\nFCM Token: ' + token,
          pretext : message,
          color : color,
          fields : [{
            title : 'Token Information',
            value : ' FCM Token: ' + token,
            short : false
          }]
        }]
      }
    }
  }
})();
