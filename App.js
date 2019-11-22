import React, {Component, Fragment} from 'react';
import { View, Alert, TouchableOpacity, Image , FlatList, KeyboardAvoidingView, SafeAreaView, TextInput, Picker, ActionSheetIOS} from 'react-native';
import { Button, Icon, Avatar, Text, SearchBar, ListItem, Input} from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ScrollView } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { styles } from './styles.js'
import TagInput from 'react-native-tags-input';
import Posting from './Posting.js';
import data from './app.json';
import firebase from './firebase.js';
import * as Facebook from 'expo-facebook';
import t from 'tcomb-form-native';


const Form = t.form.Form;

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

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

const Post = t.struct({
  title: t.String,
  class: t.String,
  professor: t.String,
  days: t.String,
  time: time,
  groupSize: groupSize,
  meetingSpot: t.String,
  description: t.maybe(t.String),
});

var options = {

};

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

  state = {
    messages: [],
  }
  get user() {
    return {
      name: this.props.screenProps.displayName,
      avatar: this.props.screenProps.ppurl,
      _id: firebase.uid
    };
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

  render() {
    return(
      <KeyboardAvoidingView style={{flex:1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={firebase.send}
          user={{}}
        />
      </KeyboardAvoidingView>
    );
  }
}

class PostingsScreen extends Component {

  mount=false;

  constructor(props){
    super(props);
    this.state = {
      posts:[],
      isPosting:false,
      seeingProfile:false,
      other:{whatever: ''},
      search: '',
      selectedbio:"null",
      selectedgrad:"null",
      selectedmajor:"null",
    };
    this.arrayholder = [];
  }

  delete(key){
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
      }
    )
  }

  componentWillUnmount(){
    this.mount=false;
  }

  addpost(){
    var value = this._form.getValue();
    if(value){
      console.log("adding to DB...");
      console.log(value);
      let postsRef = firebase.database().ref("posts/");
      postsRef.push({title:value.title,class:value.class,days:value.days,time:value.time,professor:value.professor,user:this.props.screenProps.data.displayName,img: this.props.screenProps.ppurl, groupSize: value.groupSize, meetingSpot: value.meetingSpot,description:value.description , uid:this.props.screenProps.uid}).getKey();
      this.setState({
        isPosting:false
      });
      Alert.alert("Successfully posted!");
    }
    else{
      Alert.alert("Please fill out all the fields");
    }
  }

  makepost(){
    this.setState({
      isPosting:true
    });
  }

  seeprofile = (postuser) =>{
    if(!(postuser==this.props.screenProps.data.displayName)){
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
    console.log(text);
  };

  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(function(item) { // Passing the inserted text in textinput

      // Applying filter for the inserted text in search bar
      const itemData  = (item.class       ? item.class.toUpperCase()       : ''.toUpperCase());
      const itemData2 = (item.title       ? item.title.toUpperCase()       : ''.toUpperCase());
      const itemData3 = (item.professor   ? item.professor.toUpperCase()   : ''.toUpperCase());
      const itemData4 = (item.days        ? item.days.toUpperCase()        : ''.toUpperCase());
      const itemData5 = (item.time        ? item.time.toUpperCase()        : ''.toUpperCase());
      const itemData6 = (item.meetingSpot ? item.meetingSpot.toUpperCase() : ''.toUpperCase());
      const itemData7 = (item.groupSize   ? item.groupSize.toUpperCase()   : ''.toUpperCase());
      const itemData8 = (item.user        ? item.user.toUpperCase()        : ''.toUpperCase());

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

    // Setting the filtered newData on datasource
    // After setting the data it will automatically re-render the view
    this.setState({
      dataSource: newData,
      search: text,
    });
  }

  deleteicon(postuser, id){
    if(postuser==this.props.screenProps.data.displayName)
      return <Icon
        name='delete'
        color='#f50'
        onPress={() => this.delete(id)} />
    else
      return <View/>;
  }


  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>{
        this.seeprofile(item.user);
        this.setState(
        {
          other:item
        });

      }}
      title={item.title}
      subtitle={
        <View>
          <Text>Class: {item.class} ({item.professor})</Text>
          <Text>Days: {item.days}</Text>
          <Text>Time: {item.time}</Text>
          <Text>Group Size: {item.groupSize}</Text>
          <Text>Meeting Spot: {item.meetingSpot}</Text>
          <Text>Additional Info: {item.description}</Text>
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

  state = {
    clas: ''
  }

  updateClas = (clas) => {
    this.setState({ clas: clas })
  }


  render() {
    if(this.state.posts.length==0 && !this.state.isPosting)
      return <TouchableOpacity onPress={()=>this.makepost()} style={{  // If database is empty
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'grey',
      }}/>
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
    else if(this.state.seeingProfile && !this.state.isPosting){
      var convert = JSON.stringify(this.state.other);
      var userData = JSON.parse(convert);
      console.log(userData);
      var firstName = (userData.user).substr(0,(userData.user).indexOf(' '));



      return(
        <ScrollView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <SafeAreaView style={styles.backButton}>
          <Icon name="arrow-back" onPress={()=>this.goBack()}/>
        </SafeAreaView>
          <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}}>
            <SafeAreaView style = {{height: 40, marginTop: 10, alignSelf: "center"}}>
              <Text style = {{fontSize: 35, lineHeight: 42, marginLeft: 0}}>{userData.user}</Text>
            </SafeAreaView>
            <SafeAreaView style={{width: 450, height: 1, backgroundColor: "black", marginTop: 20}} />
            <SafeAreaView style={styles.imageRow}>
              <Avatar style={styles.pic}
                large
                rounded
                source={{uri: userData.img}}
                activeOpacity={0.7}
              />
              <SafeAreaView style={styles.majorRowColumn}>
                <SafeAreaView style={styles.majorRow}>
                  <Text style = {{fontSize: 20}}>Major:</Text>
                  <Text> {this.state.selectedmajor}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.gradYearStack}>
                  <Text style = {{fontSize: 20}}>Grad Year:</Text>
                    <Text> {this.state.selectedgrad}</Text>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
              <SafeAreaView style={styles.bio}>
              <Text style = {{fontSize: 20}}>Bio:</Text>
                <Text>{this.state.selectedbio}
                  </Text>
              </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              onPress={()=>this.props.navigation.navigate('Chat')}
              title="Request to Chat"
              buttonStyle={{backgroundColor: '#397BE2', marginTop: 30, width: 200}}
            />
          </SafeAreaView>
        </ScrollView>
      );
    }
    else if(this.state.isPosting && !this.state.seeingProfile){
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
            <SafeAreaView style={{flexDirection: 'column', alignItems: 'center'}}>
              <View style={{marginBottom: 10}}>
                <Button title="Post" buttonStyle={{backgroundColor: '#397BE2', width:200}} onPress={()=>this.addpost()}/>
              </View>
              <View style={{marginBottom: 10}}>
                <Button title="Cancel" buttonStyle={{backgroundColor: 'red', width:100}} onPress={()=>this.goBack()}/>
              </View>
            </SafeAreaView>
          </SafeAreaView>
        </ScrollView>
      );
    }
  }
}

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: '',
        tagsArray: []
      },
      bio:"temp",
      grad:"temp",
      major:"temp"
    };

  }
  updateTagState = (state) => {
    this.setState({
      tags: state
    })
  };
  updateProfile=(maj, gradient, bio)=>
  {
    let postsRef = firebase.database().ref("users/"+this.props.screenProps.uid);
    console.log(this.state.major)
    postsRef.once('value', function(snapshot) {
      if(bio!=""&&bio!="temp")
      postsRef.update({
        'bio':bio
      });
postsRef.update({
  'bio':bio
});
if(maj!=""&&maj!="temp")
postsRef.update({
  'major':maj,
});
if(gradient!=""&&gradient!="temp")
postsRef.update({
  'grad':gradient
});
    
   
   
  
    });
}
biochange=(val)=>{this.setState({bio:val});
}
majorchange=(val)=>{this.setState({major:val});
}
gradchange=(val)=>{this.setState({grad:val});
}
  render() {
    return(
      <ScrollView style={styles.mainWrapper}>
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
                    placeholder="Major..."
                    label="Major: "
                    onChangeText={(maj) => this.majorchange(maj)}
                  />
                </SafeAreaView>
              <SafeAreaView style={styles.gradYearStack}>
                <Input
                  placeholder="Year..."
                  label="Graduation Year: "
                  onChangeText={(gradyr) =>this.gradchange(gradyr)}
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
            onChangeText={(big)=>this.biochange(big)}
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
            onPress={()=>this.updateProfile(this.state.major, this.state.grad , this.state.bio)}
            title="Save Changes"
            buttonStyle={{backgroundColor: '#397BE2', marginTop: 30, width: 200}}
          />
          <Button
            onPress={this.props.screenProps.signOut}
            title="Logout of Facebook"
            buttonStyle={{backgroundColor: '#397BE2', marginTop: 30, width: 200}}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

///////////////////////Steven's code///////////////////////


class OtherProfile extends Component {
  render() {
    return(
      <ScrollView style={styles.mainWrapper}>
        <View style = {styles.profileSafeArea2}>
          <Text style = {styles.profileNameStyle}>Other</Text>
        </View>
        <View style={styles.profileSafeArea3} />
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
      </ScrollView>
    );
  }
}

class PostingsCreation extends Component {
  state = {clas: ''}
  updateClas = (clas) => {
    this.setState({ clas: clas })
  }
  render() {
    return(
      <View style={styles.mainWrapper}>
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
      </View>
    );
  }
}

class PostingDetails extends Component {
     state = {clas: ''}
   updateClas = (clas) => {
      this.setState({ clas: clas })
   }
  render() {
    return(
      <View style={styles.mainWrapper}>
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
      </View>
    );
  }
}

///////////////////////Steven's code///////////////////////


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
