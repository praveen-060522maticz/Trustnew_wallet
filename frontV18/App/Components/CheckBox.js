import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const CustomCheckBox = ({ label, onChange }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable
      onPress={() => {
        setChecked(!checked);
        onChange?.(!checked);
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
      }}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#444',
          backgroundColor: checked ? '#4caf50' : '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        }}
      >
        {checked && (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
        )}
      </View>
      <Text>{label}</Text>
    </Pressable>
  );
};

export default CustomCheckBox;
