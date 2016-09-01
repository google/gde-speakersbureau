// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////
//


  /**
     * Function called when clicking the Login/Logout button.
     */
    function toggleSignIn() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      } else {
        firebase.auth().signOut();
      }
      document.getElementById('sign-in').disabled = true;
    }

    /**
     * initApp handles setting up the Firebase context and registering
     * callbacks for the auth status.
     */
    function initApp() {
      // Result from Redirect auth flow.
      firebase.auth().getRedirectResult().then(function(result) {
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          console.error(error);
        }
      });

      // Listening for auth state changes.
      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
          // User is signed in.
          gUser = new User(user.uid, user.email, user.displayName, user.photoURL);
          document.getElementById('sign-in').textContent = 'Sign out';

          loadEvents();

        } else {
          // User is signed out.
          clearOnLogout();
          document.getElementById('sign-in').textContent = 'Sign in';
        }
        document.getElementById('sign-in').disabled = false;
      });
      document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
    }
    window.onload = function() {
      initApp();
    };
