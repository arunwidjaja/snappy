import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Scoreboard'>;

export default function ScoreboardScreen({ navigation, route }: Props) {
  const { teams, scores } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Final Scores</Text>
      {teams.map((team, i) => (
        <Text key={i} style={styles.teamScore}>
          {team}: {scores[i]} points
        </Text>
      ))}
      <View style={styles.spacer} />
      <Button title="Play Again" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  teamScore: { fontSize: 20, marginBottom: 10 },
  spacer: { height: 20 },
});
