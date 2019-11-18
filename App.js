import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, Image , FlatList, ImageBackground} from 'react-native';
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
    this.setState({isLoggedIn: false});
    console.log("logged out...");
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
mount=false;
  constructor(props){
    super(props);

    this.state = {
      posts:[]
    };
  }
  delete(key){
    console.log(key);
    let postsRef = firebase.database().ref("posts/"+key);
    postsRef.remove();
  }
  componentDidMount= async () =>{
    let postsRef = firebase.database().ref("posts/");
    this.mount=true;


    postsRef.on('value',snapshot => {  
      const fbObject = snapshot.val();
      const newArr = Object.keys(fbObject).map((key) => {
        fbObject[key].id = key;
        return fbObject[key];
      });
      
      this.setState({
        posts:newArr
      });

  
  },
  (error) => {
    console.log(error)
  })
}
componentWillUnmount(){
  this.mount=false;
}
addpost()
{
  let postsRef = firebase.database().ref("posts/");
  var newitem = postsRef.push({title: "Digital Logic",descrption:"abc",days:"MWF",time:"evening",professor:"ruiz",user:"sami"}).getKey();
  console.log(newitem);

}

  render() {
    if(this.state.posts.length==0)
    
      return <TouchableOpacity onPress={()=>this.addpost()} style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'grey',
  
      }}/>
      
    
    else{
      console.log(this.state.posts);
    return (
      <Fragment>
      <FlatList
      data={this.state.posts}
      extraData={this.state}
      renderItem={({item}) => <Posting title={item.title} description={item.description} professor={item.professor} days={item.days} time={item.time} user={item.user} delete={()=>this.delete(item.id)}></Posting>}
      />
      <TouchableOpacity onPress={()=>this.addpost()} style={{
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: 'green',
        alignItems: 'center',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30
    }}>
      <Icon style={styles.icon} name='add' size={60}/>
    </TouchableOpacity>
    
    </Fragment>
    );
  }
}
}

class ProfileScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        <Text><Image style={{width: 100,height: 100,padding: 10}} source={{uri: this.props.screenProps.ppurl}}/>{this.props.screenProps.data.displayName}</Text>
        <Button
          title="Logout of Facebook" 
          color="#3c50e8"
        />
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
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
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