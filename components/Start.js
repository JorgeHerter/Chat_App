
// components/Start.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

// The background image for the start screen
const bgImage = require('../assets/background-image.png');

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  // Preset colors
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Chat App</Text>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
        </View>

        <Text style={styles.colorLabel}>Choose Background Color:</Text>
        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color }, bgColor === color && styles.colorSelected]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Chat', { name, bgColor })}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Start;

// Start screen styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  colorLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

