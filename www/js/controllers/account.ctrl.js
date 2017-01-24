angular.module('starter')
    .controller('accountCtrl', accountCtrl);

function accountCtrl(loggedInUserService, firebaseService, $localForage, $state, $timeout, $templateCache){
    
    var account = this;

    account.signOut = signOut;
    account.user = loggedInUserService.info;

    function signOut(){
        firebase.auth().signOut().then(function() {

            loggedInUserService = {};
            $localForage.clear();
            $templateCache.removeAll()

            $state.go('login');
        }, function(error) {
            console.log('Signout Error!')
        });
    }
}