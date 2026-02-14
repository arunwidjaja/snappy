import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Surface, TouchableRipple } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PlayedWord } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundResults'>;

export default function RoundResultsScreen({ navigation, route }: Props) {
  const {
    teams,
    players,
    currentTeamIndex,
    currentPlayerIndices,
    scores,
    scoreLimit,
    duration,
    freeSkips,
    freeSkipCount,
    playedWords: initialWords,
  } = route.params;

  const [playedWords, setPlayedWords] = useState<PlayedWord[]>(initialWords);
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  const currentPlayer = players[currentTeamIndex][currentPlayerIndices[currentTeamIndex]];
  const skipCount = playedWords.filter(w => !w.guessed).length;
  const penaltySkips = freeSkips ? 0 : Math.max(0, skipCount - freeSkipCount);
  const roundScore = playedWords.reduce((sum, w) => sum + (w.guessed ? w.value : 0), 0) - penaltySkips;
  const updatedScores = scores.map((s, i) =>
    i === currentTeamIndex ? s + roundScore : s,
  );
  const updatedPlayerIndices = currentPlayerIndices.map((idx, i) =>
    i === currentTeamIndex ? (idx + 1) % players[i].length : idx,
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
      <Text variant="headlineMedium" style={styles.heading}>Round Over!</Text>
      <Text variant="bodyLarge" style={styles.playerLabel}>{currentPlayer}</Text>

      <Surface style={styles.scoreCard} elevation={3}>
        <Text variant="displaySmall" style={styles.score}>{roundScore}</Text>
      </Surface>

      <Surface style={styles.wordListCard} elevation={2}>
        <FlatList
          data={playedWords}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <TouchableRipple onPress={() => toggleWord(index)}>
              <View style={[styles.wordRow, index < playedWords.length - 1 && styles.wordRowBorder]}>
                <Text
                  variant="bodyLarge"
                  style={[styles.wordText, item.guessed ? styles.guessedText : styles.skippedText]}
                >
                  ({item.value}) {item.word}
                </Text>
                <View style={[styles.badge, item.guessed ? styles.guessedBadge : styles.skippedBadge]}>
                  <Text variant="labelMedium" style={styles.badgeText}>
                    {item.guessed ? 'Guessed' : 'Skipped'}
                  </Text>
                </View>
              </View>
            </TouchableRipple>
          )}
        />
      </Surface>

      <Text variant="bodyMedium" style={styles.nextUp}>
        Next up: {teams[nextTeamIndex]}
      </Text>

      <Button
        mode="contained"
        onPress={() =>
          gameOver
            ? navigation.navigate('Scoreboard', {
                teams,
                players,
                scores: updatedScores,
              })
            : navigation.navigate('ReadyUp', {
                teams,
                players,
                currentTeamIndex: nextTeamIndex,
                currentPlayerIndices: updatedPlayerIndices,
                scores: updatedScores,
                scoreLimit,
                duration,
                freeSkips,
                freeSkipCount,
              })
        }
        contentStyle={styles.nextBtnContent}
        labelStyle={styles.nextBtnLabel}
      >
        Next Round
      </Button>

      <View style={styles.bottomButton}>
        {confirmingQuit ? (
          <Surface style={styles.confirmCard} elevation={1}>
            <Text variant="titleSmall" style={styles.confirmText}>Quit game?</Text>
            <View style={styles.confirmRow}>
              <Button
                mode="contained"
                buttonColor="#c62828"
                textColor="#fff"
                onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
              >
                Yes, Quit
              </Button>
              <Button mode="outlined" onPress={() => setConfirmingQuit(false)}>
                Cancel
              </Button>
            </View>
          </Surface>
        ) : (
          <Button
            mode="outlined"
            textColor="#c62828"
            onPress={() => setConfirmingQuit(true)}
            style={styles.quitBtn}
          >
            Quit Game
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f6f2ff',
  },
  heading: {
    fontWeight: 'bold',
    color: '#1c1b1f',
    marginBottom: 4,
  },
  playerLabel: {
    color: '#79747e',
    marginBottom: 16,
  },
  scoreCard: {
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    fontWeight: 'bold',
    color: '#6750A4',
  },
  wordListCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    width: '100%',
    flexGrow: 0,
    maxHeight: '40%',
    overflow: 'hidden',
    marginBottom: 16,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  wordRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  wordText: {
    flex: 1,
  },
  guessedText: {
    color: '#2e7d32',
  },
  skippedText: {
    color: '#c62828',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  guessedBadge: {
    backgroundColor: '#c8e6c9',
  },
  skippedBadge: {
    backgroundColor: '#ffcdd2',
  },
  badgeText: {
    fontWeight: '600',
  },
  nextUp: {
    color: '#79747e',
    marginBottom: 16,
  },
  nextBtnContent: {
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  nextBtnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomButton: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  quitBtn: {
    borderColor: '#c62828',
  },
  confirmCard: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  confirmText: {
    color: '#1c1b1f',
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
