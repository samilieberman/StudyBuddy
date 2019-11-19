import React, {Component, Fragment} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image , FlatList, ImageBackground, SafeAreaView} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import data from './app.json';
import * as Facebook from 'expo-facebook';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import t from 'tcomb-form-native';
import { Button, Icon, Avatar, Text, SearchBar } from 'react-native-elements';

const Form = t.form.Form;

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
//Icon.loadFont();
import firebase from './firebase.js';
// import { NPN_ENABLED } from 'constants';

const Post = t.struct({
  title: t.String,
  description: t.String,
  professor: t.String,
  days: t.String,
  time: t.String
});


export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoggedIn: false,
      data: [],
      ppurl:"null",
      signOut:this.signOutWithFacebook
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
      posts:[],
      isPosting:false
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
addpost(newTitle,newProfessor,newDays,newTime,newDescription)
{
  let postsRef = firebase.database().ref("posts/");
  var newitem = postsRef.push({title:newTitle,description:newDescription,days:newDays,time:newTime,professor:newProfessor,user:this.props.screenProps.data.displayName}).getKey();
  console.log(newitem);
  this.setState({
    isPosting:false
  });
  Alert.alert("successfully posted");
}
makepost()
{
  this.setState({
    isPosting:true
  }); 
}
goBack()
{
  this.setState({
    isPosting:false
  });
}
  render() {
    if(this.state.posts.length==0 && !this.state.isPosting)
    
      return <TouchableOpacity onPress={()=>this.makepost()} style={{ // if database is empty
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'grey',
  
      }}/>
      
    
    else if (!this.state.isPosting){
      console.log(this.state.posts);
    return (
      <Fragment>
        <View style={{marginTop:50}}>
          <SearchBar round lightTheme 
          placeholder='Type Here...'
          />
        </View>
      <FlatList
      data={this.state.posts}
      extraData={this.state}
      renderItem={({item}) => <Posting title={item.title} description={item.description} professor={item.professor} days={item.days} time={item.time} user={item.user} delete={()=>this.delete(item.id)}></Posting>}
      />
      <Icon reverse
            name='add' 
            color="green"
            onPress={()=>this.makepost()}
      />
    
    </Fragment>
    );
  }
  else
    return(
    <SafeAreaView>
      <Text style={styles.paragraph}>New Post</Text> 
      <View style={styles.form}>
        <Form type={Post} ref={c => this._form = c}/>
      </View>
      <Button style={{alignSelf:'center'}} title="Post" buttonStyle={{backgroundColor: '#397BE2'}} onPress={()=>this.addpost(this._form.getValue().title,this._form.getValue().professor,this._form.getValue().days,this._form.getValue().time,this._form.getValue().description)}/>
      <Text></Text>
      <Button style={{alignSelf:'center'}} title="Cancel" buttonStyle={{backgroundColor: 'red', size: '5'}} onPress={()=>this.goBack()}/>
    </SafeAreaView>
    );
}
}

class ProfileScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d0d0d0'}}>
        {/* <Text><Image style={{width: 100,height: 100,padding: 10}} source={{uri: this.props.screenProps.ppurl}}/>{this.props.screenProps.data.displayName}</Text> */}
        <Avatar style={styles.pic}
          large
          rounded
          //title="SL"
          source={{uri: this.props.screenProps.ppurl}}
          activeOpacity={0.7}
        />
        <Text></Text>
        <Text h2>{this.props.screenProps.data.displayName}</Text>
        <Text></Text>
        <Button
          onPress={this.props.screenProps.signOut}
          title="Logout of Facebook" 
          buttonStyle={{backgroundColor: '#397BE2'}}
        />
      </View>
    );
  }
}

class LoginScreen extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.titleText}> Study Buddy </Text>
        <Icon style={styles.icon} name="school" size={60} />
       <Button
         title="Login with Facebook"
         onPress={this.props.signInWithFacebook}
         buttonStyle={{backgroundColor: '#397BE2'}}>
       </Button>
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
  // button:{
  //   alignItems: 'center',
  //   backgroundColor: '#3b5998',
  //   padding: 10,
  //   flexDirection: 'column'
  // },
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
  form: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  paragraph:{
    margin:24,
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center'
  },
  cancel:{
    backgroundColor: 'red',
  },
  pic:{
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow:'hidden'
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