// This code is courtesy of a MIT Licensed, customizable Input component for React Native.
// The original can be found here:
// https://github.com/jimmybengtsson/react-native-tags-input

import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableHighlight,
  ViewPropTypes
} from 'react-native';

class Tags extends React.Component {

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  isFocused() {
    return this.input.isFocused();
  }

  setNativeProps(nativeProps) {
    this.input.setNativeProps(nativeProps);
  }

  renderLabel = (text, style) => {
    return (
      <Text style={style}>
      {text}
      </Text>
  )
  };

  renderLeftElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.leftElement, style])}>
      {element}
      </View>
  )
  };

  renderRightElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.rightElement, style])}>
      {element}
      </View>
  )
  };

  onChangeText = (text, tags, updateState, keysForTags, onKey) => {

    let keysStr;
    if (typeof keysForTags === 'string') {
      keysStr = keysForTags;
    } else {
      keysStr = ' ';
    }

    if (text.includes(keysStr)) {
      if (text === keysStr) {
        return
      }
      let tempTag = text.replace(keysStr, '');
      let tempArray = tags.tagsArray;
      tempArray.push(tempTag);
      let tempObject = {
        tag: '',
        tagsArray: tempArray
      };
      updateState(tempObject);
      onKey(tempObject);
      return this.input.clear();
    }
    let tempObject = {
      tag: text,
      tagsArray: tags.tagsArray
    };
    return updateState(tempObject)
  };

  deleteTag = (tagToDelete, tags, updateState , onDelete) => {

    let tempArray = tags.tagsArray;
    tempArray.splice(tagToDelete, 1);

    let tempObject = {
      tag: tags.tag,
      tagsArray: tempArray
    };
    onDelete(tempObject);
    updateState(tempObject);
  };

  render() {
    const {
      containerStyle,
      disabled,
      disabledInputStyle,
      inputContainerStyle,
      leftElement,
      leftElementContainerStyle,
      rightElement,
      rightElementContainerStyle,
      inputStyle,
      label,
      labelStyle,
      tags,
      tagStyle,
      tagTextStyle,
      tagsViewStyle,
      updateState,
      onDelete,
      onKey,
      keysForTag,
      deleteIconStyles,
      customElement,
    } = this.props;

    const props = this.props;
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {label ? this.renderLabel(label, StyleSheet.flatten([styles.labelStyle, labelStyle])) : null}
        <View style={StyleSheet.flatten(StyleSheet.flatten([styles.inputContainer, inputContainerStyle]))}>
          {leftElement ? this.renderLeftElement(leftElement, leftElementContainerStyle) : null}
          <TextInput
            underlineColorAndroid="transparent"
            editable={!disabled}
            ref={ref => {
              this.input = ref;
            }}
            style={StyleSheet.flatten([
                styles.input,
                inputStyle,
                disabled && styles.disabledInput,
                disabled && disabledInputStyle,
              ])}
            {...props}
            value={tags.tag}
            onChangeText={text => this.onChangeText(text, tags, updateState, keysForTag, onKey)}
        />
        {rightElement ? this.renderRightElement(rightElement, rightElementContainerStyle) : null}
      </View>
        {customElement ? customElement : null}
      <View style={StyleSheet.flatten([styles.tagsView, tagsViewStyle])}>
        {tags.tagsArray.map((item, count) => {
            return (
              <View
                style={StyleSheet.flatten([styles.tag, tagStyle])}
                key={count}
              >
              <Text style={StyleSheet.flatten([styles.tagText, tagTextStyle])}>{item}</Text>
              <TouchableHighlight onPress={() => this.deleteTag(count, tags, updateState, onDelete) }>
                <Image
                  source={require('./assets/close.png')}
                  style={StyleSheet.flatten([styles.deleteIcon, deleteIconStyles])}
                  />
            </TouchableHighlight>
            </View>
          )
          })}
        </View>
      </View>
  );
  }
}

Tags.propTypes = {
  disabled: PropTypes.bool,
  leftElement: PropTypes.element,
  rightElement: PropTypes.element,
  customElement: PropTypes.element,
  label: PropTypes.string,
  tags: PropTypes.object,
  updateState: PropTypes.function,
  onDelete: PropTypes.function,
  onKey: PropTypes.function,
  keysForTag: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  inputStyle: ViewPropTypes.style,
  disabledInputStyle: ViewPropTypes.style,
  leftElementContainerStyle: ViewPropTypes.style,
  rightElementContainerStyle: ViewPropTypes.style,
  labelStyle: ViewPropTypes.style,
  deleteIconStyles: ViewPropTypes.style,
};

const styles = {
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  leftElement: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightElement: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    minHeight: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  tagsView: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    height: 26,
    borderRadius: 13,
    backgroundColor: '#979797',
    minWidth: 40,
    maxWidth: 200,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  tagText: {
    marginHorizontal: 5
  },
  labelStyle: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: -4
  },
  deleteIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
    marginLeft: 5
  }
};

export default Tags;
