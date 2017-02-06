angular.module('starter')
    .controller('accountCtrl', accountCtrl);

function accountCtrl(currentUser, firebaseService, $localForage, $state, $templateCache, $ionicModal, $scope, $firebaseObject, $ionicLoading) {

    var ac = angular.extend(this, {
        signOut: signOut,
        user: currentUser.info,
        verified: firebase.auth().currentUser.emailVerified,
        submit: false,
        emailVerify: emailVerify,
        emailChange: emailChange,
        changePassword: changePassword,
    });

    activate();

    function activate() {
        // Change Status
        var rootRef = firebase.database().ref().child('users/' + currentUser.info.userId + '/status');
        var rootObj = $firebaseObject(rootRef);
        rootObj.$bindTo($scope, "status");

        $ionicModal.fromTemplateUrl('change-email.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            ac.changeEmailModal = modal;
        });

        $ionicModal.fromTemplateUrl('change-password.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            ac.changePasswordModal = modal;
        });

    }

    function signOut() {
        firebase.auth().signOut().then(function () {
            delete currentUser['info'];
            $localForage.clear();
            $templateCache.removeAll();

            firebaseService.rootRef.child('users/' + ac.user.userId).update({
                deviceToken: ''
            });

            $state.go('login');

            if (window.cordova) {
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar("Log out successful", 'SHORT', "", function () {
                    })
                }
            } else {
                alert("Log out successful");
            }
        }, function (error) {
            if (window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'LONG', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            } else {
                alert(error.message);
            }
        });

        ac.submit = false;
    }

    function emailVerify() {

        $ionicLoading.show({
            template: 'Sending verification mail....',
        });

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
                $ionicLoading.hide();

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

                $ionicLoading.hide();

            });
        } else {
            ac.verified = user.emailVerified;
        }
    }

    function emailChange(email, password) {

        if (ac.user.email != email) {
            $ionicLoading.show({
                template: 'Changing email....'
            });

            var user = firebase.auth().currentUser;

            var credential = firebase.auth.EmailAuthProvider.credential(
                ac.user.email,
                password
            );

            user.reauthenticate(credential).then(function () {

                user.updateEmail(email).then(function () {
                    $ionicLoading.hide();

                    if (window.cordova) {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar("Email has been changed", 'SHORT', "", function () {
                            });
                        }
                    } else {
                        alert("Email has been changed");
                    }

                    ac.changeEmailModal.hide();

                    firebaseService.rootRef.child('users/' + ac.user.userId).update({
                        email: email
                    });

                }, function (error) {

                    $ionicLoading.hide();

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
                ac.submit = false;

            }, function (error) {
                // An error happened
                ac.submit = false;
                $ionicLoading.hide();

                if (window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                        });
                    }
                } else {
                    alert(error.message);
                }
            });

        } else {
            alert('New email should be different from current email');
        }

        ac.submit = false;
    }

    function changePassword(oldPassword, password) {

        $ionicLoading.show({
            template: 'Changing password....'
        });
        var user = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(
            ac.user.email,
            oldPassword
        );
        user.reauthenticate(credential).then(function () {
            // User re-authenticated.
            user.updatePassword(password).then(function () {
                $ionicLoading.hide();

                if (window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar("Password has been changed!", 'SHORT', "", function () {
                        });
                    }
                } else {
                    alert("Password has been changed!");
                }
                ac.changePasswordModal.hide();

            }, function (error) {
                $ionicLoading.hide();
                if (window.cordova) {
                    console.log('cordova');
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                        cordova.plugins.snackbar(error.message, 'SHORT', "Dismiss", function () {
                            console.log('Dismiss Button Clicked');
                        });
                    }
                } else {
                    alert(error.message);
                }
                ac.changePasswordModal.hide();
            });

            ac.changePassword = {};
            ac.submit = false;

        }, function (error) {
            // An error happened.
            $ionicLoading.hide();
            ac.submit = false;

            if (window.cordova) {
                console.log('cordova');
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(error.message, 'INDEFINITE', "Dismiss", function () {
                        console.log('Dismiss Button Clicked');
                    });
                }
            } else {
                alert(error.message);
            }
        });
    }

}