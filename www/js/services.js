angular.module('starter.services', [])
    .service('currentUser', currentUser)
    .service('firebaseService', firebaseService)
    .service('friendsService', friendsService);

function currentUser(){
  return {}
}

function firebaseService($firebaseArray){
  return {
    rootRef : firebase.database().ref(),
    usersArray : $firebaseArray(firebase.database().ref('users')),
    chatsArray : $firebaseArray(firebase.database().ref('chats')),
  }
}

function friendsService(){
  return {}
}
