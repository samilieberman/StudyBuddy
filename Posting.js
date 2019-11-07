import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();



export default class Posting extends React.Component {
    render() {
        return (
            <View>
                <Text style={styles.author}>{this.props.title}</Text>
                <Text style={styles.message}>{this.props.desc}</Text>
            </View>
        );
}
}
const styles = StyleSheet.create({
    container: {
        width: "100 %",
        //marginBottom: 5,

    },
    author: {
        color: "gray",
        fontSize: 25
    },
    message: {
        color: "black",
        fontSize: 20
    }


});