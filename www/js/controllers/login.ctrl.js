angular.module('starter')
    .controller('loginCtrl', loginCtrl);

function loginCtrl($state, firebaseService, $localForage, $timeout, loggedInUserService, friendsService) {

    /* Check User LoggedIn or Not */


    $localForage.getItem('loggedInUser').then(function(data){
        if(data!=null) {
            loggedInUserService.info = data;
            
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

                var firstName = login.usersArray.$getRecord(data.uid).firstName;
                console.log(login.usersArray.$getRecord(data.uid).firstName);
                var lastName = login.usersArray.$getRecord(data.uid).lastName;

                $localForage.setItem('loggedInUser',{
                    firstName : firstName,
                    lastName : lastName,
                    email: data.email,
                    userId: data.uid,
                });

                loggedInUserService.info = {
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