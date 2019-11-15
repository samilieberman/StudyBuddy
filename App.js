import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import firebase from './firebase.js'
import data from './app.json';
import * as Facebook from 'expo-facebook';
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();

export default class App extends React.Component {

  constructor(props){
    super(props);
    var username;

    this.state = {
      isLoggedIn: false, 
      name: "test"
    };
  }

  signInWithFacebook = async () => {
    try {
      const {
        type,
        token 
      } = await Facebook.logInWithReadPermissionsAsync(data.expo.extra.facebook.facebookAppId, {
        permissions: ['public_profile'],
      });
      if (type === 'success') {

        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        var myname=(await response.json()).name;
        Alert.alert('Logged in!', `Hi ${myname}!`);

        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
          alert(`Facebook Login Error: ${message}`);
        });
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        firebase.auth().onAuthStateChanged(user => {
          if (user != null) {
              console.log(user);
              //firebase.auth.user.getIdToken(true);
              userName = user.providerData[0].displayName;
              //firebase.auth().set
              username = userName;
              this.setState({isLoggedIn: true, name: userName});
              
          }
        });
      }
      else { // type === 'cancel'
        this.setState({isLoggedIn: false, name: ""});
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  signOutWithFacebook = async () => {  
    // not sure what to do here yet
    // need to clear token
  }

  getCurrentUser(){
    return this.username;
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    if (isLoggedIn) {
      return <AppContainer />;
    }
    else{
    return <LoginScreen signInWithFacebook={this.signInWithFacebook}/>;
    }
  }
}

// Postings, Chat, Profile, Login


class ChatScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text> This is my Chat screen </Text>
      </View>
    );
  }
}

class PostingsScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#d0d0d0', width:"100%"}}>
        {/* <Text> This is my Postings screen</Text> */}
        <Posting title="<Title>" desc="<Description>" profef="I" days="Want" time="to" user="die"></Posting>
        <Posting title="<Title>" desc="<Description>" profef="I" days="Want" time="to" user="die"></Posting>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text>profile page</Text>
        <Button
          onPress={this.props.signOutWithFacebook}
          title="Logout of Facebook" 
          color="#3c50e8"
        />
        {/* <Text>{App.getCurrentUser()}</Text> */}
      </View>
    );
  }
}

class LoginScreen extends React.Component {
  render() {
    return(
      // <View style={styles.container}>
      //   <Text>Study Buddy</Text>
      //   <Button
      //     onPress={this.props.signInWithFacebook}
      //     title="Login with Facebook" 
      //     color="#3c50e8"
      //   />
      // </View>
      <View style={styles.container}>
        <Text style={styles.titleText}> Study Buddy </Text>
        <Icon style={styles.icon} name="school" size={60} />
       <TouchableOpacity
         style={styles.button}
         onPress={this.props.signInWithFacebook}>
         <Text style={{color: 'white'}}> Login with Facebook </Text>
       </TouchableOpacity>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 60,
    textAlign: 'center',
    flexDirection: 'column',
    fontFamily: 'San Francisco'
  },
  icon:{
    textAlign: 'center',
    flexDirection: 'column'
  },
  button:{
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  }
})

const bottomTabNavigator = createBottomTabNavigator(
  {
    Postings: {
      screen: PostingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={25} color={tintColor} />
        )
      }
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="message" size={25} color={tintColor} />
        )
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="person" size={25} color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: 'Postings',
    tabBarOptions: {
      activeTintColor: '#3b5998'
    }
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);