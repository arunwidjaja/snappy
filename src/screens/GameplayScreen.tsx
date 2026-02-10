import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

export default function GameplayScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>0:30</Text>
      <Text style={styles.word}>EXAMPLE WORD</Text>
      <View style={styles.buttonRow}>
        <Button title="Skip" onPress={() => {}} />
        <Button title="Got It!" onPress={() => {}} />
      </View>
      <Button
        title="End Round (placeholder)"
        onPress={() => navigation.navigate('RoundResults')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  timer: { fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  word: { fontSize: 42, fontWeight: 'bold', marginBottom: 40 },
  buttonRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
});
