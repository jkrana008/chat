angular.module('starter')
    .controller('accountCtrl', accountCtrl);

function accountCtrl(currentUser, firebaseService, $localForage, $state, $templateCache, friendsService){
    
    var account = this;

    account.signOut = signOut;
    account.user = currentUser.info;

    account.verified = firebase.auth().currentUser.emailVerified;
    account.verify = verify;

    function verify() {
        user.sendEmailVerification().then(function () {
            console.log('email varification is send!')
        }, function (error) {
            console.log('Email varification failed!')
        });
    }


    function signOut(){
        firebase.auth().signOut().then(function() {

            currentUser = {};
            $localForage.clear();
            $templateCache.removeAll()
            friendsService = {};

            $state.go('login');
        }, function(error) {
            console.log('Signout Error!')
        });
    }
}