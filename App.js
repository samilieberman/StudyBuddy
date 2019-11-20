import React, {Component, Fragment} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image , FlatList, KeyboardAvoidingView, SafeAreaView, TextInput, Picker, ActionSheetIOS} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Posting from './Posting.js';
import data from './app.json';
import * as Facebook from 'expo-facebook';
import t from 'tcomb-form-native';
import { Button, Icon, Avatar, Text, SearchBar, ListItem, Input} from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import TagInput from 'react-native-tags-input';

const Form = t.form.Form;

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
//Icon.loadFont();
import firebase from './firebase.js';
import { ScrollView } from 'react-native-gesture-handler';
// import { NPN_ENABLED } from 'constants';

var groupSize = t.enums({
  "Small": 'Small Group (< 4)',
  "Big": 'Big Group (≥ 4)',
  "No Preference": 'No Preference'
});
var time = t.enums({
  "Morning": 'Morning',
  "Afternoon": 'Afternoon',
  "Evening": 'Evening',
  "Any Time": 'Any Time'
});

const Post = t.struct({
  title: t.String,
  //description: t.String,
  class: t.String,
  professor: t.String,
  days: t.String,
  time: time,
  groupSize: groupSize,
  meetingSpot: t.String,
  description: t.String,
});

//console.log("test");
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
  state = {
    messages: [],
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello study buddy!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
  render() {
    return(
    <KeyboardAvoidingView style={{flex:1}}>
     <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
     />
     </KeyboardAvoidingView>
    );
  }
}

class PostingsScreen extends React.Component {
  mount=false;

  constructor(props){
    super(props);
    this.state = {
      posts:[],
      isPosting:false,
      gettingDetails:false,
      search: ''
    };
    this.arrayholder = [];
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
      if(fbObject==null)
        return 0;
      const newArr = Object.keys(fbObject).map((key) => {
        fbObject[key].id = key;
        return fbObject[key];
      });
      this.setState({
        posts:newArr,
        dataSource: newArr,
      });
      this.arrayholder = newArr;

  },
  (error) => {
    console.log(error)
  })
}
componentWillUnmount(){
  this.mount=false;
}
addpost(newTitle,newClass,newProfessor,newDays,newTime,newGroupSize,newMeetingSpot,newDescription)
{
  let postsRef = firebase.database().ref("posts/");
  var newitem = postsRef.push({title:newTitle,class:newClass,days:newDays,time:newTime,professor:newProfessor,user:this.props.screenProps.data.displayName,img: this.props.screenProps.ppurl, groupSize: newGroupSize, meetingSpot: newMeetingSpot,description:newDescription}).getKey();
  console.log(newitem);
  this.setState({
    isPosting:false
  });
  Alert.alert("Successfully Posted");
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

search = text => {
  console.log(text);
};
clear = () => {
  this.search.clear();
};
SearchFilterFunction(text) {
  //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = (item.class ? item.class.toUpperCase() : ''.toUpperCase());
      const itemData2 = (item.title ? item.title.toUpperCase() : ''.toUpperCase());
      const itemData3 = (item.professor ? item.professor.toUpperCase() : ''.toUpperCase());
      const itemData4 = (item.days ? item.days.toUpperCase() : ''.toUpperCase());
      const itemData5 = (item.time ? item.time.toUpperCase() : ''.toUpperCase());
      const itemData6 = (item.meetingSpot ? item.meetingSpot.toUpperCase() : ''.toUpperCase());
      const itemData7 = (item.groupSize ? item.groupSize.toUpperCase() : ''.toUpperCase());
      const itemData8 = (item.user ? item.user.toUpperCase() : ''.toUpperCase());

      const textData = text.toUpperCase();
      return (itemData.indexOf(textData) > -1) ||
        (itemData2.indexOf(textData) > -1) ||
        (itemData3.indexOf(textData) > -1) ||
        (itemData4.indexOf(textData) > -1) ||
        (itemData5.indexOf(textData) > -1) ||
        (itemData6.indexOf(textData) > -1) ||
        (itemData7.indexOf(textData) > -1) ||
        (itemData8.indexOf(textData) > -1);
  });
  this.setState({
    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    dataSource: newData,
    search: text,
  });
}

deleteicon(postuser, id)
{
  if(postuser==this.props.screenProps.data.displayName)
    return <Icon
      name='delete'
      color='#f50'
      onPress={() => this.delete(id)} />
  else
    return<View/>;
}

renderItem = ({ item }) => (
  <ListItem
    onPress={()=>{Alert.alert(item.url)}}
    title={item.title}
    subtitle={
  <View>
    <Text>Class: {item.class} ({item.professor})</Text>
    <Text>Days: {item.days}</Text>
    <Text>Time: {item.time}</Text>
    <Text>Group Size: {item.groupSize}</Text>
    <Text>Meeting Spot: {item.meetingSpot}</Text>
    <Text>Description: {item.description}</Text>
    <Text>User: {item.user}</Text>
  </View>}
leftAvatar={{
  source: { uri: item.img },
}}
rightIcon={
  this.deleteicon(item.user, item.id)
}
bottomDivider
chevron
/>
)

  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>/*this.details()*/Alert.alert(item.user)}
      title={item.title}
      subtitle={
        <View>
          <Text>Professor: {item.professor}</Text>
          <Text>Class: {item.description}</Text>
          <Text>Days: {item.days}</Text>
          <Text>Time: {item.time}</Text>
          <Text>User: {item.user}</Text>
        </View>
      }
      leftAvatar={{
        source: { uri: item.img },
      }}
      rightIcon={
        this.deleteicon(item.user, item.id)
      }
      bottomDivider
      chevron
    />
  )
  state = {clas: ''}
  updateClas = (clas) => {
   this.setState({ clas: clas })
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
        <SafeAreaView>
          <SearchBar lightTheme round
            platform = 'ios'
            placeholder='Search by class'
            value={this.state.search}
            onChangeText={text => this.SearchFilterFunction(text)}
            onClear={text => this.SearchFilterFunction('')}
          />
       </SafeAreaView>

      <FlatList
        data={this.state.dataSource}
        extraData={this.state}
        renderItem={ this.renderItem}
      />
      <TouchableOpacity style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              position: 'absolute',
              bottom: 10,
              right: 5
          }}>
        <Icon reverse
            name='add'
            color="green"
            onPress={()=>this.makepost()}
          />
        </TouchableOpacity>

      </Fragment>
      );
    }
  else
    return(
    <ScrollView>
    <SafeAreaView>
      <SafeAreaView style={styles.backButton}>
        <Icon name="arrow-back" onPress={()=>this.goBack()}/>
      </SafeAreaView>
      <Text style={styles.paragraph}>New Post</Text>
      <View style={styles.form}>
        <Form type={Post} ref={c => this._form = c}/>
      </View>
      <Button style={{alignSelf:'center'}} title="Post" buttonStyle={{backgroundColor: '#397BE2'}} onPress={()=>this.addpost(this._form.getValue().title,this._form.getValue().class,this._form.getValue().professor,this._form.getValue().days,this._form.getValue().time,this._form.getValue().groupSize,this._form.getValue().meetingSpot,this._form.getValue().description)}/>
      <Text></Text>
      <Button style={{alignSelf:'center'}} title="Cancel" buttonStyle={{backgroundColor: 'red', size: '2'}} onPress={()=>this.goBack()}/>
    </SafeAreaView>
    </ScrollView>
    );
}
}

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: '',
        tagsArray: []
      },
    };
  }
  updateTagState = (state) => {
    this.setState({
      tags: state
    })
  };
  render() {
    return(
      <ScrollView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}}>
        <SafeAreaView style = {{height: 40, marginTop: 30, alignSelf: "center"}}>
          <Text style = {{fontSize: 35, lineHeight: 42, marginLeft: 0}}>{this.props.screenProps.data.displayName}</Text>
        </SafeAreaView>
        <SafeAreaView style={{width: 450, height: 1, backgroundColor: "black", marginTop: 20}} />
          <SafeAreaView style={styles.imageRow}>
            <Avatar style={styles.pic}
              large
              rounded
              source={{uri: this.props.screenProps.ppurl}}
              activeOpacity={0.7}
            />
            <SafeAreaView style={styles.majorRowColumn}>
              <SafeAreaView style={styles.majorRow}>
              <Input
                placeholder="Major..."
                label="Major: "
             />
            </SafeAreaView>
            <SafeAreaView style={styles.gradYearStack}>
              <Input
                placeholder="Year..."
                label="Graduation Year: "
              />
            </SafeAreaView>
            </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView style={styles.bio}>
            <Input
                placeholder="Tell us about yourself.."
                label="Biography: "
                returnKeyType="done"
                blurOnSubmit={true}
                enablesReturnKeyAutomatically={true}
                multiline={true}
             />
            <SafeAreaView style={{marginTop:30}}>
            <Input
              disabled
              label = "Classes (seperate by comma to add a new class)"
              inputContainerStyle={{borderBottomWidth: 0}}
              />

            <TagInput
              updateState={this.updateTagState}
              tags={this.state.tags}
              keysForTag={','}
              placeholder="Class code"
            />
            </SafeAreaView>
            </SafeAreaView>

            <Button
              onPress={this.props.screenProps.signOut}
              title="Logout of Facebook"
              buttonStyle={{backgroundColor: '#397BE2', marginTop: 30}}
            />
          </SafeAreaView>
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
  gradYear: {
    top: 7,
    left: 0,
    color: "#121212",
    position: "absolute",
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
    marginTop: 8,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  paragraph:{
    margin:24,
    marginBottom: 10,
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center'
  },
  cancel:{
    backgroundColor: 'red',
  },
  majorRow: {
      height: 25,
      //flexDirection: "row",
      marginRight: 16
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
      width: 230,
      height: 27,
      marginTop: 50
    },
  majorRowColumn: {
      width: 245,
      marginLeft: 26,
    },
  imageRow: {
      width: 400,
      height: 118,
      flexDirection: "row",
      marginTop: 18,
      marginLeft: 37,
      marginRight: 14
    },
  pic:{
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow:'hidden',
    },
  bio:{
    width: 400,
    height: 400,
    marginTop: 40
  },
  tag:{
    width: 400,
    height: 400,
    marginTop: 5
  },
  backButton:{
    marginLeft: 15,
    flexDirection: 'row'
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
      activeTintColor: '#3b5998',
      keyboardHidesTabBar: false
    }
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);
