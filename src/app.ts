declare var elasticsearch;
declare var UIkit;
import { ESFactory as esF } from './resources/services/esFactory'
declare var firebase; 
export class App {
  esurl = 'http://localhost:9200';
  heading = 'elastic5earch toolbox';
  userName: any;
  photoURL: any;
  public client: Elasticsearch.Client;
  indexes: any[];
  factory: esF;
  constructor() {
    this.factory = new esF();
    var newthis = this;
    firebase.auth().onAuthStateChanged(function (authUser) {
      if (authUser) {
        console.log(authUser) // User is signed in.
        newthis.userName = authUser.displayName;
        newthis.photoURL = authUser.photoURL;
      } else {
        console.log(authUser) // User is signed in.
        // No user is signed in.
      }
    });
  }
  async connectToES() {
    try {
      this.indexes = await this.factory.getIndexData(this.esurl);
      UIkit.notification({
        message: `<span uk-icon='icon: check'></span> Connected`,
        status: 'success',
        pos: 'top-right',
        timeout: 2000
      });
    } catch (error) {
      this.indexes = undefined;
      UIkit.notification({ message: "<span uk-icon='icon: warning'></span> " + error.message, status: 'danger', pos: 'top-right', timeout: 5000 })
    }
   

  }
  async disconnectToES() {
    try {
      this.indexes = this.client = undefined;
      UIkit.notification({
        message: `<span uk-icon='icon: check'></span> Disconnected`,
        status: 'success',
        pos: 'top-right',
        timeout: 2000
      });
    } catch (error) {
      this.indexes = undefined;
      UIkit.notification({ message: "<span uk-icon='icon: warning'></span> " + error.message, status: 'danger', pos: 'top-right', timeout: 5000 })
    }
  }
  async tryGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result: any) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function (error: any) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  async tryGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

  }

  logout() {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      location.reload();
    }, function (error) {
      // An error happened.
    });
  }
}

