angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'LocalForageModule','ngMessages'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $ionicConfigProvider, $urlRouterProvider) {
    $ionicConfigProvider.views.maxCache(0);
  $stateProvider

      // Login State
      .state('login',{
          url : '/login',
          cache: false,
          templateUrl : 'templates/login.html',
          controller : 'loginCtrl',
          controllerAs : 'login',
      })

      // Signup State
      .state('signup',{
          url : '/signup',
          cache: false,
          templateUrl : 'templates/signup.html',
          controller : 'signupCtrl',
          controllerAs : 'signup',
      })

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab', 
            cache: false,
        abstract: true,
        templateUrl: 'templates/tabs.html',
    })

    // Each tab has its own nav history stack:
    /* Friends Tab */
    .state('tab.friends', {
        url: '/friends',
        cache: false,
        views: {
        'tab-friends': {
            templateUrl: 'templates/tab-friends.html',
            controller: 'friendsCtrl as friends',
        },
        },
    })
      /* Friends Chat State */
      .state('tab.friendsChat',{
          url : '/friends/:name/:id',
          views : {
              'tab-friends' : {
                  templateUrl : 'templates/tab-chat.html',
                  controller : 'chatCtrl as chat',
              }
          }
      })

      // Chats Chat State */
      .state('tab.chats',{
          url : '/chats',
          params : {
              name : null,
              id : null,
          },
          views : {
              'tab-chats' : {
                  templateUrl: 'templates/tab-chats.html',
                  controller: 'chatsCtrl as chats',
              }
          }
      })

      .state('tab.chatsChat',{
          url : '/chats/:name/:id',
          views : {
              'tab-chats' : {
                  templateUrl : 'templates/tab-chat.html',
                  controller : 'chatCtrl as chat',
              }
          }
      })
      

    .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
        'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'accountCtrl as account',
            },
        },
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
