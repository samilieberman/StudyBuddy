import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import firebase from './firebase'
import * as Facebook from 'expo-facebook';
//import Icon from "react-native-vector-icons/FontAwesome";
// "react-native-gesture-handler": "^1.5.0",
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.name = "test";
    this.state = {isLoggedIn: false};
  }
  signInWithFacebook = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('791644631286317', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        this.setState({isLoggedIn: true});
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
        firebase.auth().currentUser.getIdToken(true);
        return name;
      } else {
        // type === 'cancel'
        this.setState({isLoggedIn: false});
        return "hi";
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      <Fragment>
        <LoginScreen signInWithFacebook={this.signInWithFacebook} />
        <AppContainer />
      </Fragment>
    );
  }
}


// Postings, Chat, Profile, Login
class PostingsScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text> This is my Postings screen</Text>
        <Posting title="<Title>" desc="<Description>"></Posting>
      </View>
    );
  }
}

class ChatScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text> This is my Chat screen </Text>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text>This is my Profile screen</Text>
        <Text> Logged in as: ${this.props.name} </Text>
      </View>
    );
  }
}

class LoginScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text>Study Buddy</Text>
        <Button 
          onPress={this.props.signInWithFacebook}
          title="Login with Facebook" 
        />
      </View>
    );
  }
}

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
      activeTintColor: '#3da3eb'
    }
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);