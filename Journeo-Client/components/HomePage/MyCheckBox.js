import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyCheckbox = ({ title, checked, onValueChange }) => {
  return (
    <TouchableOpacity style={styles.checkboxRow} onPress={onValueChange}>
      <View style={styles.checkboxContainer}>
        {checked ? (
          <Ionicons name="checkbox" size={24} color="#007AFF" /> // Checked icon
        ) : (
          <Ionicons name="square-outline" size={24} color="gray" /> // Unchecked icon
        )}
      </View>
      <Text style={styles.checkboxLabel}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxContainer: {
    marginRight: 10,
    marginLeft: 5,
  },
  checkboxLabel: {
    fontSize: 16, // Adjust as needed
  },
});

export default MyCheckbox;

