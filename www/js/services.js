angular.module('starter.services', [])
    .service('loggedInUserService', loggedInUserService)
    .service('firebaseService', firebaseService)
    .service('friendsService', friendsService);

function loggedInUserService(){
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
