angular.module('starter')
    .controller('signupCtrl', signupCtrl);

function signupCtrl($state, firebaseService, $localForage, $timeout, currentUser, $rootScope) {

    var signup = this;
    signup.rootRef = firebaseService.rootRef;
    signup.usersArray = firebaseService.usersArray;
    signup.submit = false;
    signup.signUp = signUp;

    function signUp(firstName, lastName, email, password) {

        if(firstName && lastName && email && password){
            firebase.auth().createUserWithEmailAndPassword(email, password).then(success, error);

            function success(data) {

                /* Update Name into Firebase Account */
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: firstName + ' ' + lastName,
                });

                if(window.cordova){
                    currentUser.info={
                        firstName : firstName,
                        lastName : lastName,
                        email: data.email,
                        userId: data.uid,
                        deviceToken : $rootScope.deviceToken,
                        status : 'Hi I am using Youstart chat now!',
                    };
                }else {
                    currentUser.info = {
                        firstName: firstName,
                        lastName: lastName,
                        email: data.email,
                        userId: data.uid,
                        deviceToken: '',
                        status : 'Hi I am using Youstart chat now!',
                    };
                }

                /* Save User Data Locally */
                $localForage.setItem('currentUser',currentUser.info);

                /* Save User Data At Firebase */
                signup.rootRef.child('users').child(data.uid).set(currentUser.info);


                /* Email Varification */
                user.sendEmailVerification().then(function() {
                    if(window.cordova) {
                        console.log('cordova');
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            cordova.plugins.snackbar('A verification mail is sent to your email!', 'INDEFINITE', "Dismiss", function () {
                                console.log('Dismiss Button Clicked');
                            });
                        }
                    }else{
                        alert(data.message);
                    }
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
                        alert(data.message);
                    }
                });

                $rootScope.$broadcast('loggedIn');

                signup.firstName = signup.lastName = signup.email = signup.password = '';
                $state.go('tab.friends');

            };

            function error(data){
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    cordova.plugins.snackbar(data.message, 'INDEFINITE', "Dismiss", function(){
                        console.log('Dismiss Button Clicked');
                    });
                }
            }
        }
    }
}