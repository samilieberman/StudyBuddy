import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './firebase.js'
Icon.loadFont();

export default class Posting extends React.Component {
    render() {
        return (
            <TouchableOpacity style={{backgroundColor:'#D0D0D0', borderBottomWidth: 1}}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.pic}/>
                <View styles={{paddingLeft:100}}>
                <Text style={styles.author}>{this.props.title}</Text>
                <Text style={styles.message}>Professor: {this.props.professor}</Text>
                <Text style={styles.message}>Description: {this.props.description}</Text>
                <Text style={styles.message}>Days: {this.props.days}</Text>
                <Text style={styles.message}>Time: {this.props.time}</Text>
                <Text style={styles.message}>User: {this.props.user}</Text>
                </View>
                <View style={{paddingLeft:100,paddingTop:10}}>
                <TouchableOpacity style={styles.deleteIcon} onPress={this.props.delete}>
                    <Icon style={styles.icon} name='delete' size={40}/>
                </TouchableOpacity>
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
        backgroundColor: 'grey',

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