angular.module('starter.services', [])
    .service('currentUser', currentUser)
    .service('firebaseService', firebaseService);

function currentUser(){
  return {}
}

function firebaseService($firebaseArray){
  return {
    rootRef : firebase.database().ref(),
    usersArray : $firebaseArray(firebase.database().ref('users')),
    chatsArray : $firebaseArray(firebase.database().ref('chats')),
    updateToken : updateToken,
  }
  
  function updateToken(token) {
    var user = firebase.auth().currentUser;
    firebase.database().ref().child('users/' + user.uid).update({
      deviceToken : token
    })
  }
}
