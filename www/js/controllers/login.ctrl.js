angular.module('starter')
    .controller('loginCtrl', loginCtrl);

function loginCtrl($state, firebaseService, $localForage, $timeout, currentUser, $ionicModal, $scope, $ionicLoading, $ionicPopup, $rootScope) {
    var lc = angular.extend(this, {
            rootRef : firebaseService.rootRef,
            usersArray : firebaseService.usersArray,
            submit : false,
            logIn : logIn,
            resetPassword : resetPassword,
    });

    activate();

    function activate() {
        $ionicLoading.show({
            template: 'Loading...',
            hideOnStateChange : true,
        })

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                lc.usersArray.$loaded()
                    .then(function () {
                        currentUser.info = firebaseService.usersArray.$getRecord(user.uid);
                        $rootScope.$broadcast('loggedIn');
                        $state.go('tab.friends');
                    })
            }else{
                $ionicLoading.hide();
            }
        }, function (error) {
            $ionicLoading.hide();

            $ionicLoading.hide();

            if(window.cordova) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                    });
                }
            }else{
                alert(error.message);
            }

        });
        

        if(window.cordova) {
            document.addEventListener("deviceready", onReady, false);

            function onReady() {
                FCMPlugin.onTokenRefresh(function(token){
                    $rootScope.deviceToken = token;
                    $rootScope.$broadcast('token updated');
                });

                FCMPlugin.getToken(function (token) {
                    $rootScope.deviceToken = token;
                });

            }

            $scope.$on('token updated', function () {
                if(currentUser.info){
                    firebaseService.updateToken($rootScope.deviceToken);
                }
            });

            $scope.$on('loggedIn', function () {
                    firebaseService.updateToken($rootScope.deviceToken);
            });
        }

    }


    function logIn(email, password){
        if(email && password) {

            $ionicLoading.show({
                template: 'Longing...',
                hideOnStateChange : true,
            })

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(success, error);
            function success(data) {
                var user = lc.usersArray.$getRecord(data.uid);
                currentUser.info = user;
                $localForage.setItem('currentUser',user);

                $rootScope.$broadcast('loggedIn');

                lc.email = lc.password  = '';
                $state.go('tab.friends');

            };

            function error(error) {

                $ionicLoading.hide();

                if(window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                        });
                    }
                }else{
                    alert(error.message);
                }
            }
        }
    }

    function resetPassword() {
        console.log();
        $scope.showPopup();
    }

    $scope.showPopup = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="data.email" placeholder="someone@example.com" style="padding:10px">',
            title: 'Reset Password',
            subTitle: 'Enter your email id',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Send</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.email) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            $ionicLoading.show({
                                template: 'Sending a password reset link...'
                            });
                            return $scope.data.email;
                        }
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            if(res) {
                firebase.auth().sendPasswordResetEmail(res).then(function () {
                    $ionicLoading.hide();
                    if(window.cordova) {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar("A password reset link is sent to your email", 'SHORT', "", function () {
                            });
                        }
                    }else{
                        alert("A password reset link is sent to your email");
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    // An error happened.
                    if(window.cordova) {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                            });
                        }
                    }else{
                        alert(error.message);
                    }
                });
            }
        });

        // $timeout(function() {
        //     myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
    };

    lc.googleLogin = function () {
        // $log.debug("Inside Google");
        document.addEventListener('deviceready', deviceReady, false);

        function deviceReady() {
            // ac.loading=true;
            // I get called when everything's ready for the plugin to be called!
            console.log('Device is ready!');
            window.plugins.googleplus.trySilentLogin(
                {
                    // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                    // 'webClientId': '528631628442-bjb7ubb6ds81lb0l7e925p3ovsb46ebr.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                    // 'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                },
                function (obj) {
                    alert(JSON.stringify(obj)); // do something useful instead of alerting
                    console.log(obj);
                },
                function (msg) {
                    alert('error: ' + msg);
                    // $timeout(function() {
                        // ac.loading=false;
                    // }, 10);
                }
            );
        }
    }
}