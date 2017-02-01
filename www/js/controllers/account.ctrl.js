angular.module('starter')
    .controller('accountCtrl', accountCtrl);

function accountCtrl(currentUser, firebaseService, $localForage, $state, $templateCache, $ionicModal, $scope, $firebaseObject) {

    var ac = angular.extend(this, {
        signOut : signOut,
        user : currentUser.info,
        verified : firebase.auth().currentUser.emailVerified,
        submit : false,
        emailVerify : emailVerify,
        emailChange : emailChange,
        changePassword : changePassword,
        changeStatus : changeStatus,
        inputType : "password"
    });

    activate();

    function activate() {

        var rootRef    = firebase.database().ref().child('users/' + currentUser.info.userId + '/status');
        var rootObj   =  $firebaseObject(rootRef);
        rootObj.$bindTo($scope,"status");

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

        $ionicModal.fromTemplateUrl('change-status.html',{
            scope : $scope,
            animation : 'slide-in-up'
        }).then(function (modal) {
            ac.changeStatusModal = modal;
        })
        
    }

    function signOut() {
        firebase.auth().signOut().then(function () {

            currentUser = {};
            $localForage.clear();
            $templateCache.removeAll();

            firebaseService.rootRef.child('users/' + ac.user.userId).update({
                deviceToken : ''
            });

            $state.go('login');

            if(window.cordova) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar("Log out successful", 'SHORT',"", function () {
                    })
                }
            }else{
                alert("Log out successful");
            }
        }, function (error) {
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'LONG', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert(error.message);
            }
        });

        ac.submit = false;
    }

    function emailVerify() {
        var user = firebase.auth().currentUser;
        if (!user.emailVerified) {
            user.sendEmailVerification().then(function () {
                if (window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar('Verification email sent!', 'LONG', "", function () {

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
        }else{
            ac.verified = user.emailVerified;
        }
    }

    function emailChange(email, password) {

        if(ac.user.email != email) {

            var user = firebase.auth().currentUser;

            var credential = firebase.auth.EmailAuthProvider.credential(
                ac.user.email,
                password
            );

            user.reauthenticate(credential).then(function() {

                user.updateEmail(email).then(function () {
                    if (window.cordova) {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar("Email has been changed", 'SHORT', "", function () {
                            });
                        }
                    } else {
                        alert("Email has been changed");
                    }

                    firebaseService.rootRef.child('users/' + ac.user.userId).update({
                        email: email
                    });

                    ac.changeEmailModal.hide();
                }, function (error) {
                    if (window.cordova) {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                            });
                        }
                    } else {
                        alert(error.message);
                    }
                    ac.changeEmailModal.hide();
                });

                ac.changeEmail = {};

            }, function(error) {
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

        }else {
            alert('New email should be different from current email');
        }

        ac.submit = false;
    }

    function changePassword(oldPassword, password){

        var user = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(
            ac.user.email,
            oldPassword
        );
        user.reauthenticate(credential).then(function() {
            // User re-authenticated.
            user.updatePassword(password).then(function() {
                if(window.cordova) {
                    console.log('cordova');
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar("Your password has been changed!", 'SHORT', "", function () {
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
                        cordova.plugins.snackbar(error.message, 'SHORT', "Dismiss", function () {
                            console.log('Dismiss Button Clicked');
                        });
                    }
                }else{
                    alert(error.message);
                }
                ac.changePasswordModal.hide();
            });

            ac.changePassword = {};
            ac.submit = false;

        }, function(error) {
            // An error happened.
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
        });
    }

    // Changing Status
    function changeStatus(status){
        firebaseService.rootRef.child('users/' + ac.user.userId).update({
            status : status
        }).then(function(){
            if(window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar("Your status has been changed!", 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            }else{
                alert("Your status has been changed!");
            }

            ac.changeStatusModal.hide();
        },function(error){
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
            ac.changeStatusModal.hide();
        });
        ac.changeStatus = {};
        ac.submit = false;
    }
}