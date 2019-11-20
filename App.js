import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, Image, TextInput, ScrollView, Picker } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import firebase from './firebase.js'
import data from './app.json';
import * as Facebook from 'expo-facebook';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from "react-native-vector-icons/Entypo";
const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
Icon.loadFont();


export default class App extends React.Component {

  constructor(props){
    super(props);
    var username;

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
        const response2 = await fetch(`https://graph.facebook.com/me/picture?width=9999&access_token=${token}`);
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

class UserProfile extends React.Component {
  render() {
    return(
      <ScrollView style={{flex: 1, backgroundColor: '#d0d0d0'}}>
        <View style = {{height: 40, marginTop: 46, alignSelf: "center"}}>
          <Text style = {{fontSize: 35, lineHeight: 42, marginLeft: 0}}>{this.props.screenProps.data.displayName}</Text>
        </View>
        <View style={{width: 450, height: 1, backgroundColor: "black", marginTop: 24}} />
        <View style={styles.imageRow}>
          <Image
            source={{uri: this.props.screenProps.ppurl}}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.majorRowColumn}>
            <View style={styles.majorRow}>
              <Text style={styles.major}>Major:</Text>
              <TextInput
                placeholder="Major.."
                textBreakStrategy="simple"
                style={styles.textInput3}
              />
            </View>
            <View style={styles.gradYearStack}>
              <Text style={styles.gradYear}>Grad year:</Text>
              <TextInput placeholder="Year.." style={styles.textInput4} />
            </View>
          </View>
        </View>
        <Text style={styles.biography}>Biography</Text>
        <TextInput
          placeholder="Tell us about yourself.."
          returnKeyType="done"
          style={styles.textInput}
          blurOnSubmit={true}
          enablesReturnKeyAutomatically={true}
          multiline={true}
        />
        <Text style={styles.classes}>Classes:</Text>
        <View style={styles.textAddedRow}>
          <Text style={styles.textAdded}>Class 1</Text>
            <EntypoIcon name="cross" style={styles.entoIcon} />
        </View>
        <View style={styles.textInput7Row}>
        <TextInput
          placeholder="Search for class.."
          editable={false}
          secureTextEntry={false}
          spellCheck={true}
          style={styles.textInput7}
        />
        <EntypoIcon name="plus" style={styles.entoIcon2} />
        </View>
        {/* <Text>{App.getCurrentUser()}</Text> */}
        {/*<Icon name="arrow-back" style={{color: "black", fontSize: 40}} />*/}
        <TouchableOpacity
          onPress={this.props.signOutWithFacebook}
          style={styles.logoutButton}
          title="Logout"
          color="#3c50e8">
          <Text style={{color: 'white'}}> Logout </Text>
        </TouchableOpacity>
        {/* <Text>{App.getCurrentUser()}</Text> */}
        {/*<Icon name="arrow-back" style={{color: "black", fontSize: 40}} />*/}
      </ScrollView>
    );
  }
}

class OtherProfile extends React.Component {
  render() {
    return(
      <ScrollView style={{flex: 1, backgroundColor: '#d0d0d0'}}>
        <View style = {{height: 40, marginTop: 46, alignSelf: "center"}}>
          <Text style = {{fontSize: 35, lineHeight: 42, marginLeft: 0}}>Other</Text>
        </View>
        <View style={{width: 450, height: 1, backgroundColor: "black", marginTop: 24}} />
        <View style={styles.imageRow}>
          <Image
            source={{uri: this.props.screenProps.ppurl}}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.majorRowColumn}>
            <View style={styles.majorRow}>
              <Text style={styles.major}>Major:</Text>

            </View>
            <View style={styles.gradYearStack}>
              <Text style={styles.gradYear}>Grad year:</Text>

            </View>
          </View>
        </View>
        <Text style={styles.biography}>Biography</Text>

        <Text style={styles.textInput}>
       According to all known laws
of aviation,


there is no way a bee
should be able to fly.


Its wings are too small to get
its fat little body off the ground.


The bee, of course, flies anyway


because bees don't care
what humans think is impossible.


Yellow, black. Yellow, black.
Yellow, black. Yellow, black.
        </Text>

        {/* <Text>{App.getCurrentUser()}</Text> */}
        {/*<Icon name="arrow-back" style={{color: "black", fontSize: 40}} />*/}
      </ScrollView>
    );
  }
}

class PostingsCreation extends React.Component {
     state = {clas: ''}
   updateClas = (clas) => {
      this.setState({ clas: clas })
   }
  render() {
    return(
      <View style={{flex: 1, backgroundColor: '#d0d0d0'}}>
        <View style={styles.iconRow}>
          <Icon name="arrow-back" style={styles.backIcon} />
          <TextInput placeholder="Assignment" textBreakStrategy="simple" style={styles.postingTextInput} />
        </View>
        <View style={{width: 450, height: 1, backgroundColor: "black", marginTop: 24}} />
          <ScrollView>
            <Text style={{fontSize: 20, marginTop: 50, marginLeft: 35, marginBottom: -50}}>Class</Text>
            <Picker selectedValue = {this.state.clas} onValueChange = {this.updateClas}>
              <Picker.Item label = "HCI" value = "HCI" />
              <Picker.Item label = "Eco" value = "ECO" />
              <Picker.Item label = "Ethics" value = "Ethics" />
            </Picker>
            <Text>Choice: {this.state.clas}</Text>
          </ScrollView>
        {/* <Text>{App.getCurrentUser()}</Text> */}
        {/*<Icon name="arrow-back" style={{color: "black", fontSize: 40}} />*/}
      </View>
    );
  }
}

class PostingDetails extends React.Component {
     state = {clas: ''}
   updateClas = (clas) => {
      this.setState({ clas: clas })
   }
  render() {
    return(
      <View style={{flex: 1, backgroundColor: '#d0d0d0'}}>
        <View style={styles.iconRow}>
          <Icon name="arrow-back" style={styles.backIcon} />
          <Text textBreakStrategy="simple" style={styles.postingTextInput}>Assignment</Text>
        </View>
        <View style={{width: 450, height: 1, backgroundColor: "black", marginTop: 24}} />
        <Text style={{fontSize: 20, marginTop: 50, marginLeft: 30}}>Class:</Text>
        <Text style={styles.preferredDayS}>Preferred Day(s)</Text>
        <Text style={styles.preferredTimeS}>Preferred Time(s)</Text>
        <Text style={styles.user}>User</Text>
        <Text style={styles.groupSize}>Group Size</Text>
        <Text style={styles.meeting}>Preferred Meeting Spot</Text>
        <EntypoIcon name="chat" style={styles.chatIcon} />
        {/* <Text>{App.getCurrentUser()}</Text> */}
        {/*<Icon name="arrow-back" style={{color: "black", fontSize: 40}} />*/}
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
  logoutButton:{
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  name: {
    color: "#121212",
    fontSize: 30,
    lineHeight: 14,
    marginTop: 62,
    alignSelf: "center"
  },
  rect: {
    width: 350,
    height: 1,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 21,
    marginLeft: 12
  },
  image: {
    width: 94,
    height: 118,
    borderRadius: 100,
    borderColor: "#000000",
    borderWidth: 0
  },
  major: {
    color: "#121212",
    marginTop: 7
  },
  textInput3: {
    width: 139,
    height: 27,
    color: "#121212",
    marginLeft: 10
  },
  majorRow: {
    height: 27,
    flexDirection: "row",
    marginRight: 16
  },
  gradYear: {
    top: 7,
    left: 0,
    color: "#121212",
    position: "absolute",
  },
  textInput4: {
    top: 0,
    left: 73,
    width: 131,
    height: 27,
    color: "#121212",
    position: "absolute",
  },
  gradYearStack: {
    width: 204,
    height: 27,
    marginTop: 18
  },
  majorRowColumn: {
    width: 204,
    marginLeft: 26,
    marginTop: 32,
    marginBottom: 14
  },
  imageRow: {
    height: 118,
    flexDirection: "row",
    marginTop: 18,
    marginLeft: 37,
    marginRight: 14
  },
  biography: {
    color: "#121212",
    marginTop: 47,
    marginLeft: 37
  },
  textInput: {
    width: 271,
    height: 168,
    color: "#121212",
    borderRadius: 13,
    borderColor: "#000000",
    borderWidth: 2,
    marginTop: 13,
    marginLeft: 37
  },
  logOut: {
    color: "#121212",
    fontSize: 30,
    lineHeight: 14,
    marginTop: 258,
    alignSelf: "center"
  },
  classes: {
   color: "#121212",
   marginTop: 39,
   marginLeft: 36
 },
 textAdded: {
   width: 120,
   height: 27,
   backgroundColor: "#3c50e8",
   color: "#121212",
   borderRadius: 8,
   borderColor: "#3c50e8",
   borderWidth: 4,
   lineHeight: 26,
   letterSpacing: 1,
   textAlign: "center",
   marginTop: 7
 },
 entoIcon: {
   color: "rgba(128,128,128,1)",
   fontSize: 40,
   marginLeft: 11
 },
 textAddedRow: {
   height: 40,
   flexDirection: "row",
   marginTop: 14,
   marginLeft: 37,
   marginRight: 167
 },
 textInput7: {
   width: 120,
   height: 27,
   backgroundColor: "#3c50e8",
   color: "#121212",
   borderRadius: 8,
   borderColor: "#3c50e8",
   borderWidth: 4,
   borderStyle: "solid",
   marginTop: 7
 },
 entoIcon2: {
   color: "rgba(128,128,128,1)",
   fontSize: 40,
   marginLeft: 11
 },
 textInput7Row: {
   height: 40,
   flexDirection: "row",
   marginTop: 6,
   marginLeft: 37,
   marginRight: 167
 },
  iconRow: {
    height: 40,
    flexDirection: "row",
    marginTop: 39,
    marginLeft: 15,
    marginRight: 108
  },
  backIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40
  },
  postingTextInput: {
    width: 158,
    height: 39,
    color: "#121212",
    fontSize: 30,
    marginLeft: 54
  },
  preferredDayS: {
    color: "#121212",
    fontSize: 20,
    marginTop: 36,
    marginLeft: 29
  },
  preferredTimeS: {
    color: "#121212",
    fontSize: 20,
    marginTop: 38,
    marginLeft: 30
  },
  user: {
    color: "#121212",
    fontSize: 20,
    marginTop: 52,
    marginLeft: 30
  },
  groupSize: {
    color: "#121212",
    fontSize: 20,
    marginTop: 48,
    marginLeft: 29
  },
  meeting: {
    color: "#121212",
    fontSize: 20,
    marginTop: 78,
    marginLeft: 34
  },
  chatIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginTop: 209,
    marginLeft: 166
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
      screen: PostingDetails,
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
