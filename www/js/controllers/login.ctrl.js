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
                template: 'Loading...',
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

            function error(data) {

                $ionicLoading.hide();

                if(window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar(data.message, 'INDEFINITE', "Dismiss", function () {
                        });
                    }
                }else{
                    alert(data.message);
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
                    console.log("email sent");
                }, function (error) {
                    $ionicLoading.hide();
                    console.log("error", error);
                    // An error happened.
                });
            }
        });

        // $timeout(function() {
        //     myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
    };

}