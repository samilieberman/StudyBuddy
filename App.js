import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
//import Icon from "react-native-vector-icons/FontAwesome";
// "react-native-gesture-handler": "^1.5.0",
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();

export default class App extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}

// Postings, Chat, Profile
class PostingScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text> This is my Postings screen</Text>
        <Posting title="die" desc="test"></Posting>
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
        <Text>this is a cry for help</Text>
      </View>
    );
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Postings: {
      screen: PostingScreen,
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
    },
  },
  {
    initialRouteName: 'Postings',
    tabBarOptions: {
      activeTintColor: '#eb6e3d'
    }
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);