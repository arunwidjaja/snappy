import React, { useState, useMemo } from 'react';
import { View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pause'>;

const PLACE_COLORS: Record<number, string> = {
  0: '#FFD700', // gold
  1: '#C0C0C0', // silver
  2: '#CD7F32', // bronze
};

export default function PauseScreen({ navigation, route }: Props) {
  const { currentTeam, roundScore, timeLeft, teams, scores } = route.params;
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  const sortedTeams = useMemo(() => {
    const entries = teams.map((name, i) => ({ name, score: scores[i] }));
    entries.sort((a, b) => b.score - a.score);
    return entries;
  }, [teams, scores]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.teamTurn}>{currentTeam}'s Turn</Text>
      <Text style={styles.timer}>{timerDisplay}</Text>
      <Text style={styles.roundScore}>Round Score: {roundScore}</Text>

      <View style={styles.scoresSection}>
        {sortedTeams.map((entry, i) => {
          const bgColor = PLACE_COLORS[i];
          const rowStyle: ViewStyle[] = [styles.teamScoreRow];
          if (bgColor) {
            rowStyle.push({ backgroundColor: bgColor });
          }
          return (
            <View key={i} style={rowStyle}>
              <Text style={styles.teamName}>{entry.name}</Text>
              <Text style={styles.teamPoints}>{entry.score}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.buttonsSection}>
        <Button title="Resume" onPress={() => navigation.goBack()} />
        {confirmingQuit ? (
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>Quit game?</Text>
            <Button
              title="Yes, Quit"
              color="#c62828"
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
              }
            />
            <Button title="Cancel" onPress={() => setConfirmingQuit(false)} />
          </View>
        ) : (
          <Button
            title="Quit Game"
            color="#c62828"
            onPress={() => setConfirmingQuit(true)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  teamTurn: {
    fontSize: 20,
    color: '#555',
    marginBottom: 10,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roundScore: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  scoresSection: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  teamScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsSection: {
    gap: 15,
    marginTop: 10,
  },
  confirmRow: {
    alignItems: 'center' as const,
    gap: 10,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 5,
  },
});
