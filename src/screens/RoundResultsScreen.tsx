import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundResults'>;

export default function RoundResultsScreen({ navigation, route }: Props) {
  const {
    teams,
    currentTeamIndex,
    scores,
    scoreLimit,
    duration,
    skipPenalty,
    freeSkips,
    roundScore,
  } = route.params;

  const currentTeam = teams[currentTeamIndex];
  const updatedScores = scores.map((s, i) =>
    i === currentTeamIndex ? s + roundScore : s,
  );
  const nextTeamIndex = (currentTeamIndex + 1) % teams.length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{currentTeam}'s Results</Text>
      <Text style={styles.placeholder}>[List of guessed words]</Text>
      <Text style={styles.placeholder}>[List of skipped words]</Text>
      <Text style={styles.score}>Round Score: {roundScore}</Text>
      <Text style={styles.nextUp}>Next up: {teams[nextTeamIndex]}</Text>
      <View style={styles.buttonColumn}>
        <Button
          title="Next Round"
          onPress={() =>
            navigation.navigate('Gameplay', {
              teams,
              currentTeamIndex: nextTeamIndex,
              scores: updatedScores,
              scoreLimit,
              duration,
              skipPenalty,
              freeSkips,
            })
          }
        />
        <Button
          title="End Game"
          onPress={() =>
            navigation.navigate('Scoreboard', {
              teams,
              scores: updatedScores,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  placeholder: { fontSize: 16, color: '#999', marginBottom: 10 },
  score: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  nextUp: { fontSize: 16, color: '#666', marginBottom: 20 },
  buttonColumn: { gap: 10 },
});
