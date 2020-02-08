import React, {Component} from 'react'
import { StyleSheet, Button, View, Alert, } from 'react-native';
import {GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin'
import firebase from 'firebase'
import config from '../../config'


class LoginController extends Component{

    constructor(){
        super()
        this.state = {
          userInfo: null,
          error: null,
          accessToken: null
        }
    }

    async componentDidMount() {
        this._configureGoogleSignIn();
    }

    _configureGoogleSignIn() { 
        GoogleSignin.configure({
          webClientId: config.webClientId,
          offlineAccess: false,
        })
    }

    _signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          this.setState({userInfo, error: null})
          Alert.alert('Nome: ' + userInfo.user.name + 'Email: ' + userInfo.user.email)
          this.onSignIn(userInfo)
          
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // sign in was cancelled
            Alert.alert('cancelled')
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation in progress already
            Alert.alert('in progress')
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            Alert.alert('play services not available or outdated')
          } else {
            Alert.alert('Something went wrong', error.toString())
            this.setState({
              error,
            })
          }
        }
    }

    _signOut = async () => {
        try {
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
    
          this.setState({userInfo: null, error: null})
          Alert.alert('Log out ok')
        } catch (error) {
          this.setState({
            error,
          })
        }
    }

    isUserEqual = (googleUser, firebaseUser) => {
      console.log('entrou2')
        if (firebaseUser) {
          
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            console.log('entrou4')
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true
            }
          }
        }
        return false
    }
      
    onSignIn = googleUser => {
        //console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        console.log('entrou1' + firebase.auth().onAuthStateChanged)
        var unsubscribe = firebase.auth().onAuthStateChanged(
          
          function(firebaseUser) {
            console.log('entrou')
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
              
              // Build Firebase credential with the Google ID token.
              var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                this.state.accessToken
              );
              // Sign in with credential from the Google user.
              firebase
                .auth()
                .signInAndRetrieveDataWithCredential(credential)
                .then(function(result) {
                  if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref('/users/' + result.user.uid)
                      .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()
                      })
                      .then(function(snapshot) {
                       
                      });
                  } else {
                    firebase
                      .database()
                      .ref('/users/' + result.user.uid)
                      .update({
                        last_logged_in: Date.now()
                      })
                     
                  }
                })
                .catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code
                  var errorMessage = error.message
                  // The email of the user's account used.
                  var email = error.email
                  // The firebase.auth.AuthCredential type that was used.
                  var credential = error.credential
                  // ...
                })
            } else {
              console.log('User already signed-in Firebase.')
            }
          }.bind(this)
        )
      }

    render() {
        return (
            <View style={styles.container}>
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Auto}
                onPress={this._signIn}
                />
                <Button onPress={this._signOut} title="Log out" />
            </View>
          )
    }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });

export default LoginController