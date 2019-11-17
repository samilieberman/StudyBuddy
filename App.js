import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import data from './app.json';
import * as Facebook from 'expo-facebook';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
Icon.loadFont();
import firebase from './firebase.js';


export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoggedIn: false, 
      data: [],
      ppurl:"null"

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
        //var rjson=await response.json();
        //Alert.alert('Logged in!', `Hi ${rjson.name}!`);
        //this.setState({name: rjson.name, ppurl: "null"});
        const response2 = await fetch(`https://graph.facebook.com/me/picture?access_token=${token}`);
        console.log(response2.url);
        this.setState({ppurl: response2.url});
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
          alert(`Facebook Login Error: ${message}`);
        });
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        firebase.auth().onAuthStateChanged(user => {
          if (user != null) {
              console.log(user);
              this.setState({data:user.providerData[0]});
              this.setState({isLoggedIn: true});
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
      //console.log(this.state.data);
      return <AppContainer screenProps={this.state}/>;
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

  state = {
    posts: []
  }

  componentDidMount() {
    let postsRef = firebase.database().ref("posts/");
    postsRef.on('value',snapshot => {  
      console.log("here " + snapshot.val());
      this.setState({ posts:snapshot.val() });
  },
  (error) => {
    console.log(error)
  })
}

  render() {
    return(
      <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#d0d0d0', width:"100%"}}>
        {/* <Text> This is my Postings screen</Text> */}
        {/* {this.state.posts.map(post => ( */}
          {/* <Posting title={post.title} desc={post.description} professor={post.professor} days={post.days} time={post.time} user="die"></Posting>
        ))} */}
        <Posting title={this.state.posts.title} description={this.state.posts.description} professor={this.state.posts.professor} days={this.state.posts.days} time={this.state.posts.time} user="die"></Posting>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text><Image style={{width: 100,height: 100,padding: 10}} source={{uri: this.props.screenProps.ppurl}}/>{this.props.screenProps.data.displayName}</Text>
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
      props:{name:this.screenProps},
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