import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundResults'>;

export default function RoundResultsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Round Results</Text>
      <Text style={styles.placeholder}>[List of guessed words]</Text>
      <Text style={styles.placeholder}>[List of skipped words]</Text>
      <Text style={styles.score}>Score: 0</Text>
      <View style={styles.buttonColumn}>
        <Button title="Next Round" onPress={() => navigation.navigate('Gameplay')} />
        <Button title="End Game" onPress={() => navigation.navigate('Scoreboard')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  placeholder: { fontSize: 16, color: '#999', marginBottom: 10 },
  score: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  buttonColumn: { gap: 10 },
});
