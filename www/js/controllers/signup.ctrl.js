angular.module('starter')
    .controller('signupCtrl', signupCtrl);

function signupCtrl($state, firebaseService, $localForage, $timeout, currentUser, friendsService) {

    var signup = this;

    signup.rootRef = firebaseService.rootRef;
    signup.usersArray = firebaseService.usersArray;
    
    signup.submit = false;
    signup.signUp = signUp;

    function signUp(firstName, lastName, email, password) {

        if(firstName && lastName && email && password){
            console.log('signup');
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(success, error);

            function success(data) {

                /* Save User Data At Firebase */
                signup.rootRef.child('users').child(data.uid).set({
                    firstName: firstName,
                    lastName : lastName,
                    email: data.email,
                    uid: data.uid,
                });

                /* Add Name into Firebase Account */
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: firstName + ' ' + lastName,
                });

                /* Email Varification */
                user.sendEmailVerification().then(function() {
                    console.log('email varification is send!')
                }, function(error) {
                    console.log('Email varification failed!')
                });


                /* Save User Data Locally */
                $localForage.setItem('loggedInUser',{
                    firstName : firstName,
                    lastName : lastName,
                    email: data.email,
                    userId: data.uid,
                });

                /* Save User Data into Service */
                currentUser.info={
                    firstName : firstName,
                    lastName : lastName,
                    email: data.email,
                    userId: data.uid,
                };

                signup.usersArray.$loaded()
                    .then(function () {
                        friendsService.friendsList = [];
                        angular.forEach(signup.usersArray, function(user){
                            if(user.uid != data.uid)
                                friendsService.friendsList.push(user);
                        })
                        $localForage.setItem('friendsList', friendsService.friendsList);

                        signup.firstName = signup.lastName = signup.email = signup.password = '';
                        $state.go('tab.friends');


                    })




                // signup.firstName = signup.lastName = signup.email = signup.password = '';
                // $state.go('tab.friends');

            };

            function error(data){
                console.log(data);
            }
        }
    }
}