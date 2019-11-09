import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';
Icon.loadFont();

export default class Posting extends React.Component {
    render() {
        return (
            <View>
                <TouchableOpacity style={styles.pic}/>
                <Text style={styles.author}>{this.props.title}</Text>
                <Text style={styles.message}>{this.props.desc}</Text>
            </View>
        );
}
}
const styles = StyleSheet.create({

    pic:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'red'
    },
    container: {
        width: "100 %",
        //marginBottom: 5,

    },
    author: {
        flex: 2, 
        flexDirection: 'row',
        color: "gray",
        fontSize: 25
    },
    message: {
        flex: 2, 
        flexDirection: 'row',
        color: "black",
        fontSize: 20
    }


});