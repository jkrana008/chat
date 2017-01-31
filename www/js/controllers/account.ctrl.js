angular.module('starter')
    .controller('accountCtrl', accountCtrl);

function accountCtrl(currentUser, firebaseService, $localForage, $state, $templateCache, $ionicModal, $scope) {

    var ac = angular.extend(this, {
        signOut : signOut,
        user : currentUser.info,
        verified : firebase.auth().currentUser.emailVerified,
        submit : false,
        verify : verify,
        changeEmail : changeEmail,
        changePassword : changePassword
    });
    activate();

    function activate() {
        $ionicModal.fromTemplateUrl('change-email.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            ac.changeEmailModal = modal;
        });
        
        $ionicModal.fromTemplateUrl('change-password.html',{
            scope : $scope,
            animation : 'slide-in-up'
        }).then(function (modal) {
            ac.changePasswordModal = modal;
        });
        
    }

    function signOut() {
        firebase.auth().signOut().then(function () {

            currentUser = {};
            $localForage.clear();
            $templateCache.removeAll();

            $state.go('login');
        }, function (error) {
            console.log('Signout Error :' + error);
        });
    }

    function verify() {
        user.sendEmailVerification().then(function () {
            if (window.cordova) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar('Verification email sent!', 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            } else {
                alert('Verification email sent!');
            }
        }, function (error) {
            if (window.cordova) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar('Unable to send verification email. Please contact the developer', 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            } else {
                alert('Unable to send verification email. Please contact the developer');
            }
        });
    }

    function changeEmail(email) {
        var user = firebase.auth().currentUser;
        user.updateEmail(email).then(function() {
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar("Your email has been changed!", 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert("Your email has been changed!");
            }

            firebaseService.rootRef.child('users/' + ac.user.userId).update({
                email : email
            });

            ac.closeEmailChangeModal();
        }, function(error) {
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert(error.message);
            }
            ac.closeEmailChangeModal();
        });
    }

    function changePassword(password){

        // var user = firebase.auth().currentUser;
        // var credential;
        //
        // // Prompt the user to re-provide their sign-in credentials
        //
        // user.reauthenticate(credential).then(function() {
        //     // User re-authenticated.
        // }, function(error) {
        //     // An error happened.
        // });

        var user = firebase.auth().currentUser;
        user.updatePassword(password).then(function() {
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar("Your password has been changed!", 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert("Your password has been changed!");
            }

            ac.changePasswordModal.hide();
        }, function(error) {
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert(error.message);
            }
            ac.changePasswordModal.hide();
        });
    }
}