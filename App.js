import React, {Component, Fragment} from 'react';
import { View, Alert, TouchableOpacity, Image , FlatList, KeyboardAvoidingView, SafeAreaView, Platform, TextInput, Picker, ActionSheetIOS, ColorPropType, TouchableNativeFeedbackBase} from 'react-native';
import { Button, Icon, Avatar, Text, SearchBar, ListItem, Input} from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { styles } from './styles.js';
import TagInput from './tagInput.js';
import Posting from './Posting.js';
import data from './app.json';
import firebase from './firebase.js';
import * as Facebook from 'expo-facebook';
import t from 'tcomb-form-native';


const Form = t.form.Form;
console.disableYellowBox = true;

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

//class formData extends React.Component{
/*
constructor(props) {
    super(props);
    this.state = {
        pickerOptions: t.enums({})
    };
}
componentDidMount() {
    //run your api call and once you have new value and options..
    //you can run your api call and update the state like this at any place - doesn't have to be componentDidMount
    let usersRef = firebase.database().ref("users/"+this.props.uid);
    console.log(this.props.uid);
    usersRef.on('value',snapshot => {
      this.setState({
          pickerOptions: t.enums({snapshot.val().classes}),
      });
    });
}
*/


//var test = {"hci": 'HCI', "eco": 'ECO'};
//console.log(test);
//test.hci = "diff";

//componentDidMount = async () =>{
//  let postsRef = firebase.database().ref("users/"+this.props.screenProps.uid);
//  console.log(this.props.uid);
//  postsRef.on('value',snapshot => {
//console.log(snapshot.val());
//  });
//}
//constructor(props) {
//  super(props);
//  this.state = {
//    test:"test"
//  };

//}
/*
var test = ["hci", "eco", "Ethics"];
console.log(test);
test = Object.assign({}, test);
console.log(test);
var groupSize = t.enums({
  "Study Partner": 'Study Partner (1)',
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
var course = t.enums(test);
const Post = t.struct({
  title: t.String,
  class: course,
  professor: t.String,
  days: t.String,
  time: time,
  groupSize: groupSize,
  meetingSpot: t.String,
  description: t.maybe(t.String),
});
*/
//}
var options = {

};
class ProfData extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      bio:"null",
      major:"null",
      grad:"null",
      clas:[]
    };
  }


  componentDidMount = async () =>{
    let postsRef = firebase.database().ref("users/"+this.props.uid);
    console.log(this.props.uid);
    postsRef.on('value',snapshot => {
      this.setState({
        bio:snapshot.val().bio,
        major:snapshot.val().major,
        grad:snapshot.val().grad,
        clas:snapshot.val().classes
      });
    });
  }

    render(){
      var classList = "";
      if(this.state.clas != undefined){
        for (var i = 0; i < this.state.clas.length; i++) {
          classList = classList.concat(this.state.clas[i]);
          if(i < this.state.clas.length - 1)
          classList = classList.concat(", ");
        }
      }
      return (
      <SafeAreaView style={{backgroundColor: '#ffffff'}}>

        <SafeAreaView style = {{marginTop: 10, flexDirection:'row',justifyContent:'space-between'}}>
             <Icon name="arrow-back" size= {40} onPress={this.props.goBack} iconStyle={{left:20}}/>
            <Text style = {{fontSize: 35,lineHeight: 40, textAlign: 'center',marginRight:20,alignSelf:'center',justifyContent:'center',alignItems: 'center'}}>{this.props.user}</Text>
          <SafeAreaView></SafeAreaView>
        </SafeAreaView>

        <SafeAreaView style={{width: 450, height: 1, backgroundColor: "black", marginTop: 20}} />
        <SafeAreaView style={styles.otherImageRow}>
          <Avatar style={styles.pic}
            large
            rounded
            source={{uri: this.props.img}}
            activeOpacity={0.7}
          />
          <SafeAreaView style={styles.majorRowColumn}>
            <SafeAreaView style={styles.majorRow}>
              <Text style = {{fontSize: 20}}>Major:</Text>
              <Text style = {{fontSize: 16}}>{this.state.major}</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.gradYearStack}>
              <Text style = {{fontSize: 20}}>Grad Year:</Text>
              <Text style = {{fontSize: 16}}>{this.state.grad}</Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>

      <SafeAreaView style={{flexDirection:'row', marginLeft:30,marginRight: 20, marginBottom: 50}}>
        <SafeAreaView style={{flexDirection:'column'}}>
        <View><Text style = {{fontSize: 20}}>Classes:</Text></View>
        <View style={{marginBottom:20}}><Text style = {{fontSize: 16}}>{classList}</Text></View>
        <View><Text style = {{fontSize: 20}}>Bio:</Text></View>
          <View style={{height: 120}} >
          <ScrollView>
            <Text style = {{fontSize: 16}}>{this.state.bio}</Text>
          </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaView>

      </SafeAreaView>)
      }
    }

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
      data: [],
      ppurl:"null",
      uid:"null",
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
        const response2 = await fetch(`https://graph.facebook.com/me/picture?width=9999&access_token=${token}`);
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
            this.setState({data:user.providerData[0], uid:user.uid});
            this.setState({isLoggedIn: true});
            let postsRef = firebase.database().ref("users/");
              postsRef.child(user.uid).once('value', function(snapshot) {
                var exists = (snapshot.val() !== null);
                if(!exists)
                {
                postsRef.child(user.uid).set({
                'name': user.providerData[0].displayName,
                'bio': "",
                'major':"",
                'grad':"",
                "classes":[]
              });
            }
              });



          }
        });

        this.mount=true;


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
      return <AppContainer screenProps={this.state}/>;
    }
    else{
    return <LoginScreen signInWithFacebook={this.signInWithFacebook}/>;
    }
  }
}

// Postings, Chat, Profile, Login

class ChatScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
    messages: [],
    ref:"",
    otherUser:this.props.navigation.getParam('uid', ''),
    convoList:[],
  }}
  get user() {
    return {
 
      name: this.props.screenProps.displayName,
      avatar: this.props.screenProps.ppurl,
      _id: firebase.uid
    };
  }
  get ref() {
    return firebase.database().ref('messages');
  }
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);
    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  }
  refOn = callback => {
    console.log(this.state.ref + "this works now")
    firebase.database().ref(this.state.ref)
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }


get timestamp() {
  return firebase.database.ServerValue.TIMESTAMP;
}
send = messages => {
  for (let i = 0; i < messages.length; i++) {
    const { text, user } = messages[i];
    const message = {
      text,
      user,
      createdAt: this.timestamp,
    };
    console.log(this.state.ref + "sending")
    firebase.database().ref(this.state.ref).push(message);
  }
};
  componentWillMount() {
    this.setState({
      messages: [],
      otherUser:this.props.navigation.getParam('otheruid', ''),
    })
  }

  componentDidMount = async() =>{
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({
        messages: [],})
    if (this.props.navigation.getParam('otheruid', '')!='')
    {
    let convoRef=firebase.database().ref('users/'+this.props.screenProps.uid).child('convos/');
    convoRef.once('value', (snapshot)=>
    {
      this.setState({otherUser:this.props.navigation.getParam('otheruid', '')})
      console.log(snapshot.val()+this.props.navigation.getParam('otheruid', ''))
      console.log(this.props.navigation.getParam('name', '')+this.props.navigation.getParam('avatar', ''))
      if(snapshot.val()==null){
        console.log(this.props.navigation.getParam('otheruid', ''));
        var convoId=this.ref.push();
        convoRef.child(this.props.navigation.getParam('otheruid', '')).set({"otherUser":this.props.navigation.getParam('otheruid', ''), "convoid":convoId.toString().replace(firebase.database().ref("/").toString(),''),"otherName":this.props.navigation.getParam('name', ''), 'avatar':this.props.navigation.getParam('avatar', '')})
        firebase.database().ref('users/'+this.props.navigation.getParam('otheruid', '')).child('convos/'+this.props.screenProps.uid).set({"otherUser":this.props.screenProps.uid, "convoid":convoId.toString().replace(firebase.database().ref("/").toString(),''),'otherName': this.props.screenProps.data.displayName, 'avatar':this.props.screenProps.ppurl});
        this.setState({ref:convoId.toString().replace(firebase.database().ref("/").toString(),'')})
    }
    else{
      var found=false;
    for(var k in snapshot.val())
    {
      console.log(snapshot.val()[k].otherUser+ " " +this.props.navigation.getParam('otheruid', ''))
      if(snapshot.val()[k].otherUser==this.props.navigation.getParam('otheruid', '')){ 
        this.setState({ref:snapshot.val()[k].convoid})
        found=true;
    }}
    if(!found)
      {
        var convoId=this.ref.push();
        console.log(this.props.navigation.getParam('name', '')+this.props.navigation.getParam('avatar', ''))
        convoRef.child(this.props.navigation.getParam('otheruid', '')).set({"otherUser":this.props.navigation.getParam('otheruid', ''), "convoid":convoId.toString().replace(firebase.database().ref("/").toString(),''), "otherName":this.props.navigation.getParam('name', ''), 'avatar':this.props.navigation.getParam('avatar', '')})
        firebase.database().ref('users/'+this.props.navigation.getParam('otheruid', '')).child('convos/'+this.props.screenProps.uid).set({"otherUser":this.props.screenProps.uid, "convoid":convoId.toString().replace(firebase.database().ref("/").toString(),''),'otherName': this.props.screenProps.data.displayName, 'avatar':this.props.screenProps.ppurl});
        this.setState({ref:convoId.toString().replace(firebase.database().ref("/").toString(),'')})
      }
   
  }
  console.log(this.state.ref + "this works now")
this.refOn(message =>
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, message),
  })),
);
}
)

}




    let classRef = firebase.database().ref("users/"+this.props.screenProps.uid)
    classRef.once('value',snapshot1 => {
    var x=[]
    var counter=0;
    
    for(var y in snapshot1.val().convos)
    {
      x[counter]={'convoid':snapshot1.val().convos[y].convoid,'avatar':snapshot1.val().convos[y].avatar,'name':snapshot1.val().convos[y].otherName}
      console.log(x[y])
      counter++;
    }
    this.setState({convoList:x})
    console.log(x)
    })
 // things I need name of other 
     //console.log(newArr);
      //convoList:snapshot.val()
     // });
    })
    };


reRef=async()=>
{
     this.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })),
    );
    this.setState({otherUser:"test"})
    }



  goBack(){
    this.setState({
      otherUser:"",
      messages:[],
    });
  }
  componentWillUnmount()
  {this.focusListener.remove()}

  render() {
    console.log(this.props.navigation.getParam('otheruid','it broke'))
    
    if(this.state.otherUser=="")
    {
      return (<SafeAreaView><FlatList
      data={this.state.convoList}
      renderItem={({ item }) => (
        <ListItem
        onPress={()=>{
          this.setState({ref :item.convoid});
          console.log(this.state.ref+item.convoid)
          this.reRef(item.convod)
        }}
        titleStyle={{fontSize: 22}}
        title={item.name}
        leftAvatar={{
          size: 80,
          source: {uri: item.avatar},
        }}
        bottomDivider
        chevron={{
          size: 30,
        }}
      />
    
      )}
    />
    </SafeAreaView>)
    }
    else {
      return(
      
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? "" : "padding"}>
          <SafeAreaView style={styles.backButton}>
      <Icon name="arrow-back" size= {40} onPress={()=>this.goBack()}/>
    </SafeAreaView>
        <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={{
          name:this.props.screenProps.data.displayName,
          avatar: this.props.screenProps.ppurl,
          id: this.props.screenProps.uid,
          _id: this.props.screenProps.uid,
        }}
      />
      </KeyboardAvoidingView>
    );
      }
  }
}


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////POSTINGS SCREEN//////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


class PostingsScreen extends Component {

  mount=false;

  constructor(props){
    super(props);
    this.state = {
      posts:[],
      isPosting:false,
      seeingProfile:false,
      textInSearch:'',
      refreshing: false,
      other:{whatever: ''},
      search: '',
      courseChoice:[],
      selectedbio:"null",
      selectedgrad:"null",
      selectedmajor:"null",
      tags: {
        tag: '',
        tagsArray: []
      },
    };
    this.arrayholder = [];
    this.tagholder = [];
    this.SearchFilterFunction = this.SearchFilterFunction.bind(this);
  }
  updateTagState = (state) => {
    this.setState({
      tags: state
    })
  };

  delete(key){
    let postsRef = firebase.database().ref("posts/"+key);
    Alert.alert('Are you sure you want to delete?', "This can't be reversed!",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => postsRef.remove()}
      ]
    );
  }

  reloadClasses =async () =>{
  let classRef = firebase.database().ref("users/" + this.props.screenProps.uid);
  classRef.once('value',snapshot => {
    var inside = snapshot.val().classes;

    this.setState({
    courseChoice: inside
    });
  })
  return 0;
}
  componentDidMount = async () =>{
    let postsRef = firebase.database().ref("posts/");
    let classRef = firebase.database().ref("users/" + this.props.screenProps.uid);
    classRef.once('value',snapshot => {
      var inside = snapshot.val().classes;

      this.setState({
      courseChoice: inside
      });
    })
    postsRef.on('value',snapshot => {

      const fbObject = snapshot.val();
      if(fbObject==null)
        return 0;
      const newArr = Object.keys(fbObject).map((key) => {
        fbObject[key].id = key;
        return fbObject[key];
      });
      this.setState({
        posts: newArr,
        dataSource: newArr,
        refreshing: false,
      });
      //this.arrayholder = newArr;
      this.tagholder = newArr;
    },
      (error) => {
        console.log(error)
      }
    )
  }

  componentWillUnmount(){
    this.mount=false;
  }

  addpost(){
    var value = this._form.getValue();
    //console.log(value);
    if(value){
      console.log("adding to DB...");
      console.log(value);
      let postsRef = firebase.database().ref("posts/");
      postsRef.push({
        title:value.title,
        class: value.class,
        days: value.days,
        time: value.time,
        professor: value.professor,
        user: this.props.screenProps.data.displayName,
        img: this.props.screenProps.ppurl,
        groupSize: value.groupSize,
        meetingSpot: value.meetingSpot,
        description: value.description,
        uid: this.props.screenProps.uid
      }).getKey();

      if(value.description == ''){
        value.description = 'N/A';
      }

      this.setState({
        isPosting:false
      });
      Alert.alert("Successfully posted!");
    }
    else{
      Alert.alert("Please fill out all the fields.");
    }
  }

  makepost(){
    this.reloadClasses()
    this.setState({
      isPosting:true
    });
  }

  seeprofile = (postuser) =>{
    if(!(postuser.user==this.props.screenProps.data.displayName)){
      this.setState({
        seeingProfile:true
      });
    }
    else{ // Clicking your own profile
      this.props.navigation.navigate('Profile');
    }
  }

  
  goBack(){
    this.setState({
      isPosting:false,
      seeingProfile:false,
    });
  }

  search = text => {
    console.log(text+ "told you so muthafaka");
  };

  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {
    const textData = text.toUpperCase();
    console.log("Text is  " + textData + ": the un-filtered data is " + this.tagholder);
    const newData = this.tagholder.filter(function(item) { // Passing the inserted text in textinput
      // Applying filter for the inserted text in search bar
      const itemData  = (item.class       ? item.class.toUpperCase()       : ''.toUpperCase());
      const itemData2 = (item.title       ? item.title.toUpperCase()       : ''.toUpperCase());
      const itemData3 = (item.professor   ? item.professor.toUpperCase()   : ''.toUpperCase());
      const itemData4 = (item.days        ? item.days.toUpperCase()        : ''.toUpperCase());
      const itemData5 = (item.time        ? item.time.toUpperCase()        : ''.toUpperCase());
      const itemData6 = (item.meetingSpot ? item.meetingSpot.toUpperCase() : ''.toUpperCase());
      const itemData7 = (item.groupSize   ? item.groupSize.toUpperCase()   : ''.toUpperCase());
      const itemData8 = (item.user        ? item.user.toUpperCase()        : ''.toUpperCase());

      return (itemData.indexOf(textData) > -1) ||
            (itemData2.indexOf(textData) > -1) ||
            (itemData3.indexOf(textData) > -1) ||
            (itemData4.indexOf(textData) > -1) ||
            (itemData5.indexOf(textData) > -1) ||
            (itemData6.indexOf(textData) > -1) ||
            (itemData7.indexOf(textData) > -1) ||
            (itemData8.indexOf(textData) > -1);
    });

    // Setting the filtered newData on datasource
    // After setting the data it will automatically re-render the view
    console.log("The filtered data is now " + newData);
    this.setState({
      textInSearch: text,
      dataSource: newData,
      search: text,
    });
  }


  SearchTag(tags){

    var searchText = this.state.textInSearch;
    // If there are no tags
    if(tags.length == 0){
      // If there is no text in the search bar
      if(searchText == ''){
        this.setState({
          dataSource: this.state.posts
        });
      }
      // If there is text in the search bar
      else{
        this.tagholder = this.state.posts;
        this.SearchFilterFunction(searchText)
      }
      return;
    }

    var filteredData = [];
    // If there are active tags
    filteredData = this.state.posts;

    for(var i = 0; i < tags.length; i++){

      filteredData = filteredData.filter((item)=>{
        const itemData  = (item.class       ? item.class.toUpperCase()       : ''.toUpperCase());
        const itemData2 = (item.title       ? item.title.toUpperCase()       : ''.toUpperCase());
        const itemData3 = (item.professor   ? item.professor.toUpperCase()   : ''.toUpperCase());
        const itemData4 = (item.days        ? item.days.toUpperCase()        : ''.toUpperCase());
        const itemData5 = (item.time        ? item.time.toUpperCase()        : ''.toUpperCase());
        const itemData6 = (item.meetingSpot ? item.meetingSpot.toUpperCase() : ''.toUpperCase());
        const itemData7 = (item.groupSize   ? item.groupSize.toUpperCase()   : ''.toUpperCase());
        const itemData8 = (item.user        ? item.user.toUpperCase()        : ''.toUpperCase());

        textData = tags[i].toUpperCase();
        return (itemData.indexOf(textData) > -1) ||
              (itemData2.indexOf(textData) > -1) ||
              (itemData3.indexOf(textData) > -1) ||
              (itemData4.indexOf(textData) > -1) ||
              (itemData5.indexOf(textData) > -1) ||
              (itemData6.indexOf(textData) > -1) ||
              (itemData7.indexOf(textData) > -1) ||
              (itemData8.indexOf(textData) > -1);
        });
        console.log("Filter " + i + ", " + textData + ": the filtered data is now " + filteredData);
      }
      this.tagholder = filteredData;
      if(searchText != ''){
        this.SearchFilterFunction(searchText);
      }
      else{
        // After filter we are setting postings to new array
        this.setState({
          dataSource: filteredData
        });
      }
    }


  deleteicon(postuser, id){
    if(postuser==this.props.screenProps.data.displayName)
      return <Icon
        size={30}
        name='delete'
        color='#f50'
        onPress={() => this.delete(id)} />
    else
      return <View/>;
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.componentDidMount();
      this.SearchTag(this.state.tags.tagsArray);
    });
  }


  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>{
        this.seeprofile(item);
        this.setState(
        {
          other:item
        });
      }}
      titleStyle={{fontSize: 22, marginBottom: 5}}
      //textDecorationLine: 'underline'
      title={item.title}
      subtitle={
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 15 }}>Class:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.class} ({item.professor}) </Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Days:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.days}</Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Time:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.time}</Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Group Size:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.groupSize}</Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Meeting Spot:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.meetingSpot}</Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Additional Info:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.description}</Text>
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>User:
            <Text style={{fontWeight: 'normal', fontSize: 15}}> {item.user}</Text>
          </Text>
        </View>}
      leftAvatar={{
        size: 80,
        source: { uri: item.img },
      }}
      rightIcon={
        this.deleteicon(item.user, item.id)
      }
      bottomDivider
      chevron={{
        size: 30,
      }}
    />
  )


  requestChat=(uid, avi, nam)=>{
    this.props.navigation.navigate('Chat',{otheruid:uid, avatar:avi, name:nam})

  }

  render() {

    var test = ["hci", "eco", "Ethics"];
    var obj={};
    for(var poop in this.state.courseChoice)
    {
      obj[this.state.courseChoice[poop]]=this.state.courseChoice[poop].toString();
    }

    console.log(obj);

    var groupSize = t.enums({
      "Study Partner": 'Study Partner (1)',
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

    var course = t.enums(obj);

    const Post = t.struct({
      title: t.String,
      class: course,
      professor: t.String,
      days: t.String,
      time: time,
      groupSize: groupSize,
      meetingSpot: t.String,
      description: t.maybe(t.String),
    });


    if(this.state.posts.length==0 && !this.state.isPosting)
      return <TouchableOpacity onPress={()=>this.makepost()} style={{  // If database is empty
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'grey',
      }}/>
//normal posting screen
    else if (!this.state.isPosting && !this.state.seeingProfile){
      return (
        <Fragment>
          <SafeAreaView>
            <SearchBar lightTheme round
              platform = 'ios'
              placeholder='Search...'
              value={this.state.search}
              onChangeText={text => this.SearchFilterFunction(text)}
              onClear={text => this.SearchFilterFunction('')}
            />
            <TagInput
              updateState={this.updateTagState}
              tags={this.state.tags}
              keysForTag={','}
              onKey={()=> this.SearchTag(this.state.tags.tagsArray)}
              onDelete={()=> this.SearchTag(this.state.tags.tagsArray)}
              placeholder="Separate filters by commas.."
              leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={'#397BE2'}/>}
              leftElementContainerStyle={{marginLeft: 3}}
              containerStyle={{width: 414}}
              inputContainerStyle={[styles.textInput, {backgroundColor: '#fff'}]}
              inputStyle={{}}
              onFocus={() => this.setState({tagsColor: '#fff', tagsText: '#397BE2'})}
              onBlur={() => this.setState({tagsColor: '#397BE2', tagsText: '#fff'})}
              autoCorrect={false}
              tagStyle={{backgroundColor: '#fff'}}
              tagTextStyle={{color: '#397BE2'}}
            />
          </SafeAreaView>
          <FlatList
            data={this.state.dataSource}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={item => item.title}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
          <TouchableOpacity style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            position: 'absolute',
            bottom: 15,
            right: 15
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
//seeing someone else's profile
    else if(this.state.seeingProfile && !this.state.isPosting){
      //var convert = JSON.stringify(this.state.other);
      //var userData = JSON.parse(convert);
      //console.log(userData);
      return(
        <SafeAreaView>
          <ProfData img={this.state.other.img} uid={this.state.other.uid} user={this.state.other.user} goBack={this.goBack}/>

        <SafeAreaView style={{flexDirection:'column'}}>
        <Button
              onPress={()=>this.requestChat(this.state.other.uid,  this.state.other.img, this.state.other.user)}
              title="Start Chatting Now"
              buttonStyle={{backgroundColor: '#397BE2', width: 200, alignSelf: 'center', position: 'absolute'}}
            />
        </SafeAreaView>
        </SafeAreaView>
      );
    }
    //create posting screen
    else if(this.state.isPosting && !this.state.seeingProfile){
      return(
        <KeyboardAwareScrollView
        extraHeight={200}
        extraScrollHeight	= {75}
        enableOnAndroid
        >
          <SafeAreaView style={{flexDirection: 'column'}}>
            <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <Icon name="arrow-back" size= {40} onPress={()=>this.goBack()}/>
              <Text style={styles.paragraph}>New Post</Text>
            </SafeAreaView>
            <View style={styles.form}>
              <Form type={Post} ref={c => this._form = c}/>
            </View>

            <SafeAreaView style={{flexDirection: 'column', alignItems: 'center'}}>
              <View style={{marginBottom: 10}}>
                <Button title="Post" buttonStyle={{backgroundColor: '#397BE2', width:150}} onPress={()=>this.addpost()}/>
              </View>
              <View style={{marginBottom: 10}}>
                <Button title="Cancel" buttonStyle={{backgroundColor: 'red', width:100}} onPress={()=>this.goBack()}/>
              </View>
            </SafeAreaView>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      );
    }
  }
}

class ProfileScreen extends Component {

  componentDidMount = async () =>{
    let postsRef = firebase.database().ref("users/"+this.props.screenProps.uid);
    console.log(this.props.uid);
    postsRef.on('value',snapshot => {
      if(snapshot.val().bio!="")
        this.setState({
          bio:snapshot.val().bio,
        });
      if(snapshot.val().grad!="")
        this.setState({
          grad:snapshot.val().grad,
        });
      if(snapshot.val().bio!="")
        this.setState({
          major:snapshot.val().major,
        });
      if(snapshot.val().classes!=undefined){
        this.setState({
          tags:{tagsArray:snapshot.val().classes},
        });
      }
    });
  }


    makeSure(){
      Alert.alert("Are you sure you want to logout?","",
        [
          {
            text: "No, go back!",
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: this.props.screenProps.signOut}
        ]
      );
    }

  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: '',
        tagsArray: []
      },
      bio:"",
      grad:"",
      major:"",
      placeholderb:"Tell us about yourself..",
      placeholderg:"Year...",
      placeholderm:"Major...",
    };

  }
  updateTagState = (state) => {
    console.log("hi"+state)
    this.setState({
      tags: state
    })
  };
  updateProfile=(maj, gradient, bio, courses)=>
  {
    console.log(courses.length);
    let postsRef = firebase.database().ref("users/"+this.props.screenProps.uid);
    console.log(this.state.major)
    postsRef.once('value', function(snapshot) {
      if(bio!=""){
        postsRef.update({
          'bio':bio
        });
      }
      if(maj!=""){
        postsRef.update({
          'major':maj,
        });
      }
      if(gradient!=""){
        postsRef.update({
          'grad':gradient
        });
      }
      postsRef.update({
        'classes':courses
      });
    });
    this.props.navigation.navigate('Profile')
    Alert.alert("Successfully updated profile!");
}
  biochange=(val)=>{this.setState({bio:val});}
  majorchange=(val)=>{this.setState({major:val});}
  gradchange=(val)=>{this.setState({grad:val});}
  render() {
    return(
      <KeyboardAwareScrollView
      extraScrollHeight	= {110}
      enableOnAndroid
      >
        <SafeAreaView style={styles.profileSafeArea1}>

          <SafeAreaView style = {styles.profileSafeArea2}>
            <Text style = {styles.profileNameStyle}>{this.props.screenProps.data.displayName}</Text>
          </SafeAreaView>

          <SafeAreaView style={styles.profileSafeArea3} />

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
                  placeholder={this.state.placeholderm}
                  value={this.state.major}
                  label="Major: "
                  onChangeText={(maj) => this.majorchange(maj)}
                  maxLength={19}
                />
              </SafeAreaView>
              <SafeAreaView style={styles.gradYearStack2}>
                <Input
                  value={this.state.grad}
                  placeholder={this.state.placeholderg}
                  label="Graduation Year: "
                  onChangeText={(gradyr) =>this.gradchange(gradyr)}
                  maxLength={15}
                />
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView style={{flexDirection:'row', marginTop: 40, marginBottom: 0}}>

          <SafeAreaView style={{flexDirection:'column', marginLeft:20,marginRight:20}}>
          <View style={{marginLeft:17}}>
              <View style={{marginLeft:0,marginRight:20}}>
                <Input
                  disabled
                  label = "Classes (seperate by comma):"
                  inputContainerStyle={{borderBottomWidth: 0, display:"none"}}
                />
              </View>
              <TagInput
                updateState={this.updateTagState}
                tags={this.state.tags}
                keysForTag={','}
                onDelete ={()=> console.log("dum")}
                onKey={()=> console.log("dum")}
                placeholder="Class code.."
                leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={'#397BE2'}/>}
                leftElementContainerStyle={{marginLeft: 3}}
                containerStyle={{width: 414}}
                inputContainerStyle={[styles.textInput, {backgroundColor: '#fff'}]}
                inputStyle={{}}
                onFocus={() => this.setState({tagsColor: '#fff', tagsText: '#397BE2'})}
                onBlur={() => this.setState({tagsColor: '#397BE2', tagsText: '#fff'})}
                autoCorrect={false}
                tagStyle={{backgroundColor: '#fff', marginBottom: 10}}
                tagTextStyle={{color: '#397BE2'}}
              />
            </View>
            <SafeAreaView style= {{marginLeft:20,marginRight:20,flex: 1, flexDirection: 'row', flexWrap: 'wrap',justifyContent: 'space-between', marginTop:10, marginBottom: 5}}>
              <Input
                value={this.state.bio}
                placeholder={this.state.placeholderb}
                label="Biography: "
                returnKeyType="done"
                blurOnSubmit={true}
                enablesReturnKeyAutomatically={true}
                multiline={true}
                onChangeText={(big)=>this.biochange(big)}
                maxLength={100}
                allowFontScaling={false}
                style={{maxHeight: 200}}
              />
            </SafeAreaView>

            <SafeAreaView style={{flex: 1, flexDirection: 'row',marginBottom: 0, marginTop: 20}}>
              <Button
                onPress={()=>this.updateProfile(this.state.major, this.state.grad , this.state.bio, this.state.tags.tagsArray)}
                title="Save Changes"
                buttonStyle={{backgroundColor: '#397BE2', width: 150, alignSelf: 'center', marginLeft: 40, marginRight:20}}
              />
              <Button
                onPress={() => this.makeSure()}
               title="Logout"
                buttonStyle={{backgroundColor: '#397BE2', marginTop: 0, width: 150, alignSelf: 'center'}}
              />
            </SafeAreaView>

          {/* </SafeAreaView> */}

          </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
        </KeyboardAwareScrollView>
    );
  }
}

class LoginScreen extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.titleText}> Study Buddy </Text>
        <Icon style={styles.icon} name="school" size={60} />
       <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
       <Button
         title="Login with Facebook"
         onPress={this.props.signInWithFacebook}
         buttonStyle={styles.loginButton}>
       </Button>
       </View>
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
      props: {name:this.screenProps},
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
