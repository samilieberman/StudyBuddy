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
    this.state = {isLoggedIn: false, name: "test"};
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
        
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        var myname=(await response.json()).name;
        Alert.alert('Logged in!', `Hi ${myname}!`);
        this.setState({isLoggedIn: true, name: myname});
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().currentUser.getIdToken(true);
        
      }
      else {
        // type === 'cancel'
        this.setState({isLoggedIn: false});
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      //<Login isLoggedIn={this.state.isLoggedIn}/>
  <Login signInWithFacebook={this.signInWithFacebook} isLoggedIn={this.state.isLoggedIn}/>

    );
  }

}
function Login(props) {
  isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <AppContainer />;
  }
  return <LoginScreen signInWithFacebook={props.signInWithFacebook} />;
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
        <Text> Logged in as: {this.props.name} </Text>
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