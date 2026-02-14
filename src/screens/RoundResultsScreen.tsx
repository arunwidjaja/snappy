import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PlayedWord } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundResults'>;

export default function RoundResultsScreen({ navigation, route }: Props) {
  const {
    teams,
    currentTeamIndex,
    scores,
    scoreLimit,
    duration,
    freeSkips,
    freeSkipCount,
    playedWords: initialWords,
  } = route.params;

  const [playedWords, setPlayedWords] = useState<PlayedWord[]>(initialWords);
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  const currentTeam = teams[currentTeamIndex];
  const originalSkipCount = initialWords.filter(w => !w.guessed).length;
  const penaltySkips = freeSkips ? 0 : Math.max(0, originalSkipCount - freeSkipCount);
  const roundScore = playedWords.reduce((sum, w) => sum + (w.guessed ? w.value : 0), 0) - penaltySkips;
  const updatedScores = scores.map((s, i) =>
    i === currentTeamIndex ? s + roundScore : s,
  );
  const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
  const cycleComplete = nextTeamIndex === 0;
  const gameOver = cycleComplete && updatedScores.some(s => s >= scoreLimit);

  const toggleWord = (index: number) => {
    setPlayedWords(prev =>
      prev.map((w, i) => (i === index ? { ...w, guessed: !w.guessed } : w)),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{currentTeam}'s Results</Text>
      <Text style={styles.score}>{roundScore}</Text>
      <FlatList
        data={playedWords}
        keyExtractor={(_, i) => String(i)}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.wordRow}>
            <Text
              style={[
                styles.wordText,
                item.guessed ? styles.guessedText : styles.skippedText,
              ]}
            >
              {"(" + `${item.value}` + ") "}{item.word}
            </Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                item.guessed ? styles.guessedButton : styles.skippedButton,
              ]}
              onPress={() => toggleWord(index)}
            >
              <Text style={styles.toggleButtonText}>
                {item.guessed ? 'Guessed' : 'Skipped'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.nextUp}>Next up: {teams[nextTeamIndex]}</Text>
      <Button
        title="Next Round"
        onPress={() =>
          gameOver
            ? navigation.navigate('Scoreboard', {
                teams,
                scores: updatedScores,
              })
            : navigation.navigate('Gameplay', {
                teams,
                currentTeamIndex: nextTeamIndex,
                scores: updatedScores,
                scoreLimit,
                duration,
                freeSkips,
                freeSkipCount,
              })
        }
      />
      <View style={styles.bottomButton}>
        {confirmingQuit ? (
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>Quit game?</Text>
            <Button
              title="Yes, Quit"
              color="#c62828"
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
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
  container: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  score: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  list: { width: '100%', flexGrow: 0, maxHeight: '50%', marginBottom: 15 },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wordText: { fontSize: 18, flex: 1 },
  guessedText: { color: '#2e7d32' },
  skippedText: { color: '#c62828' },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginLeft: 10,
  },
  guessedButton: { backgroundColor: '#c8e6c9' },
  skippedButton: { backgroundColor: '#ffcdd2' },
  toggleButtonText: { fontSize: 14, fontWeight: '600' },
  nextUp: { fontSize: 16, color: '#666', marginBottom: 15 },
  bottomButton: { marginTop: 'auto', paddingBottom: 30 },
  confirmRow: { alignItems: 'center' as const, gap: 10 },
  confirmText: { fontSize: 16, fontWeight: '600' as const, marginBottom: 5 },
});
