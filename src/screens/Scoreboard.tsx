import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Scoreboard'>;

export default function ScoreboardScreen({ navigation, route }: Props) {
  const { teams, scores } = route.params;

  const maxScore = Math.max(...scores);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Final Scores</Text>

      <Surface style={styles.card} elevation={2}>
        {teams.map((team, i) => (
          <View
            key={i}
            style={[styles.teamRow, i < teams.length - 1 && styles.teamRowBorder]}
          >
            <Text
              variant="titleMedium"
              style={[styles.teamName, scores[i] === maxScore && styles.winnerText]}
            >
              {team}
            </Text>
            <Text
              variant="headlineSmall"
              style={[styles.teamScore, scores[i] === maxScore && styles.winnerText]}
            >
              {scores[i]}
            </Text>
          </View>
        ))}
      </Surface>

      <View style={styles.bottom}>
        <Button
          mode="contained"
          onPress={() => navigation.popToTop()}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          Play Again
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#f6f2ff',
  },
  heading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1c1b1f',
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  teamRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  teamName: {
    color: '#1c1b1f',
    fontWeight: '600',
  },
  teamScore: {
    fontWeight: 'bold',
    color: '#1c1b1f',
  },
  winnerText: {
    color: '#6750A4',
  },
  bottom: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  btnContent: {
    paddingVertical: 8,
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
