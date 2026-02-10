import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

export default function GameSetupScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Game Setup</Text>
      <Text style={styles.placeholder}>[Timer duration selector]</Text>
      <Text style={styles.placeholder}>[Team configuration]</Text>
      <Text style={styles.placeholder}>[Word category selector]</Text>
      <Button title="Start Game" onPress={() => navigation.navigate('Gameplay')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  placeholder: { fontSize: 16, color: '#999', marginBottom: 15 },
});
