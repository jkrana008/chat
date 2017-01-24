angular.module('starter')
    .controller('loginCtrl', loginCtrl);

function loginCtrl($state, firebaseService, $localForage, $timeout, currentUser, friendsService) {

    /* Check User LoggedIn or Not */


    $localForage.getItem('loggedInUser').then(function(data){
        if(data!=null) {
            currentUser.info = data;
            
            $localForage.getItem('friendsList').then(function (data) {
                friendsService.friendsList = data;
                $state.go('tab.friends');
            });
        }
    });

    var login = this;

    login.rootRef = firebaseService.rootRef;
    login.usersArray = firebaseService.usersArray;
    login.submit = false;
    login.logIn = logIn;
    



    function logIn(email, password){
        
        if(email && password) {

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(success, error);

            function success(data) {

                // /* check email verified or Not */
                // if(data.emailVerified == false){
                //     var user = firebase.auth().currentUser;
                //     user.sendEmailVerification().then(function() {
                //         console.log('email varification is send!')
                //     }, function(error) {
                //         console.log('Email varification failed!')
                //     });
                // }
                
                var firstName = login.usersArray.$getRecord(data.uid).firstName;

                var lastName = login.usersArray.$getRecord(data.uid).lastName;

                $localForage.setItem('loggedInUser',{
                    firstName : firstName,
                    lastName : lastName,
                    email: data.email,
                    userId: data.uid,
                });

                currentUser.info = {
                    firstName : firstName,
                    lastName : lastName,
                    email: data.email,
                    userId: data.uid,
                };

                login.usersArray.$loaded()
                    .then(function () {
                        friendsService.friendsList = [];
                        angular.forEach(login.usersArray, function(user){
                            if(user.uid != data.uid)
                                friendsService.friendsList.push(user);
                        })

                        $localForage.setItem('friendsList', friendsService.friendsList);

                        login.email = login.password  = '';
                        $state.go('tab.friends');

                    });
                // login.email = login.password = '';
                //
                // $state.go('tab.friends');
            };

            function error(data) {
                console.log(data.message);
            }
        }
    }
}