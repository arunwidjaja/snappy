import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

export default function GameplayScreen({ navigation, route }: Props) {
  const { teams, currentTeamIndex, scores, scoreLimit, duration, skipPenalty, freeSkips } =
    route.params;
  const currentTeam = teams[currentTeamIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.teamName}>{currentTeam}'s Turn</Text>
      <Text style={styles.timer}>0:{String(duration).padStart(2, '0')}</Text>
      <Text style={styles.word}>EXAMPLE WORD</Text>
      <View style={styles.buttonRow}>
        <Button title="Skip" onPress={() => {}} />
        <Button title="Got It!" onPress={() => {}} />
      </View>
      <Button
        title="End Round (placeholder)"
        onPress={() =>
          navigation.navigate('RoundResults', {
            teams,
            currentTeamIndex,
            scores,
            scoreLimit,
            duration,
            skipPenalty,
            freeSkips,
            roundScore: 0,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  teamName: { fontSize: 22, fontWeight: '600', marginBottom: 10, color: '#555' },
  timer: { fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  word: { fontSize: 42, fontWeight: 'bold', marginBottom: 40 },
  buttonRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
});
