import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Icon, Avatar, SearchBar } from 'react-native-elements';
import firebase from './firebase.js'


export default class Posting extends React.Component {
    render() {
        if(this.props.user==this.props.currentUser)
        return (
                <TouchableOpacity style={{backgroundColor:'#D0D0D0', borderBottomWidth: 1}}>
                <SafeAreaView style={styles.container}>
                <TouchableOpacity>
                <Avatar style={styles.pic}
                    large
                    rounded
                    //title="SL"
                    source={{uri: this.props.img}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
                <TouchableOpacity 
                    style={{
                        width: 60,  
                        height: 60,   
                        borderRadius: 30,  
                        flex:2
                    }}
                    onPress={this.props.delete}>
                <Icon reverse
                    name='delete' 
                    color="red"
                />
                </TouchableOpacity>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.pic}/>     */}
                <View styles={{paddingLeft:100,}}>
                <Text style={styles.author}>{this.props.title}</Text>
                <Text style={styles.message}>Professor: {this.props.professor}</Text>
                <Text style={styles.message}>Description: {this.props.description}</Text>
                <Text style={styles.message}>Days: {this.props.days}</Text>
                <Text style={styles.message}>Time: {this.props.time}</Text>
                <Text style={styles.message}>User: {this.props.user}</Text>
                </View>

                
            </SafeAreaView>
            </TouchableOpacity>
        );
        else 
        return (
            <TouchableOpacity style={{backgroundColor:'#D0D0D0', borderBottomWidth: 1}}>
            <SafeAreaView style={styles.container}>
            <TouchableOpacity>
            <Avatar style={styles.pic}
                large
                rounded
                //title="SL"
                source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
            />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.pic}/>     */}
            <View styles={{paddingLeft:100}}>
            <Text style={styles.author}>{this.props.title}</Text>
            <Text style={styles.message}>Professor: {this.props.professor}</Text>
            <Text style={styles.message}>Description: {this.props.description}</Text>
            <Text style={styles.message}>Days: {this.props.days}</Text>
            <Text style={styles.message}>Time: {this.props.time}</Text>
            <Text style={styles.message}>User: {this.props.user}</Text>
            </View>

            
        </SafeAreaView>
        </TouchableOpacity>
    );

}
}
const styles = StyleSheet.create({

    pic:{
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow:'hidden'
    },
    deleteIcon:{
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: 'red',

    },
    container: {
        width: "100%",
        //marginBottom: 5,
        flexDirection:'row',
        //backgroundColor: 'cyan'

    },
    author: {
        paddingLeft:20,
        color: "black",
        fontSize: 25
    },
    message: {
        paddingLeft:20,
        color: "black",
        fontSize: 20
    }


});