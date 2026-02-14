import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, IconButton, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PlayedWord } from '../navigation/types';
import WORDS from '../data/words.json';

type WordEntry = { word: string; value: number };

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

function getRandomEntry(currentWord: string): WordEntry {
  let next = WORDS[Math.floor(Math.random() * WORDS.length)];
  while (next.word === currentWord) {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return next;
}

export default function GameplayScreen({ navigation, route }: Props) {
  const { teams, players, currentTeamIndex, currentPlayerIndices, scores, scoreLimit, duration, freeSkips, freeSkipCount } =
    route.params;
  const currentTeam = teams[currentTeamIndex];
  const currentPlayer = players[currentTeamIndex][currentPlayerIndices[currentTeamIndex]];

  const [currentEntry, setCurrentEntry] = useState(() => getRandomEntry(''));
  const [playedWords, setPlayedWords] = useState<PlayedWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isFocused, setIsFocused] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const playedWordsRef = useRef<PlayedWord[]>([]);

  // Keep ref in sync so the timer callback always sees the latest list
  useEffect(() => {
    playedWordsRef.current = playedWords;
  }, [playedWords]);

  const skipCount = playedWords.filter(w => !w.guessed).length;
  const penaltySkips = freeSkips ? 0 : Math.max(0, skipCount - freeSkipCount);
  const roundScore = playedWords.reduce((sum, w) => sum + (w.guessed ? w.value : 0), 0) - penaltySkips;
  const freeSkipsRemaining = freeSkips ? null : Math.max(0, freeSkipCount - skipCount);

  // Pause/resume timer based on screen focus
  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setIsFocused(true);
      setCountdown(3);
    });
    const unsubBlur = navigation.addListener('blur', () => {
      setIsFocused(false);
    });
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  // 3-2-1 countdown before gameplay begins
  useEffect(() => {
    if (!isFocused || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isFocused, countdown]);

  // Game timer (only runs after countdown finishes)
  useEffect(() => {
    if (!isFocused || countdown > 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocused, countdown]);

  // Navigate to results when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.replace('RoundResults', {
        teams,
        players,
        currentTeamIndex,
        currentPlayerIndices,
        scores,
        scoreLimit,
        duration,
        freeSkips,
        freeSkipCount,
        playedWords: playedWordsRef.current,
      });
    }
  }, [timeLeft]);

  const handleSkip = useCallback(() => {
    setPlayedWords(prev => [...prev, { word: currentEntry.word, value: currentEntry.value, guessed: false }]);
    setCurrentEntry(prev => getRandomEntry(prev.word));
  }, [currentEntry]);

  const handleGuessed = useCallback(() => {
    setPlayedWords(prev => [...prev, { word: currentEntry.word, value: currentEntry.value, guessed: true }]);
    setCurrentEntry(prev => getRandomEntry(prev.word));
  }, [currentEntry]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, '0')}`;

  if (countdown > 0) {
    return (
      <View style={styles.countdownContainer}>
        <Surface style={styles.countdownCircle} elevation={3}>
          <Text variant="displayLarge" style={styles.countdownText}>{countdown}</Text>
        </Surface>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.timer}>{timerDisplay}</Text>

      <Surface style={styles.wordCard} elevation={2}>
        <Text variant="displaySmall" style={styles.word}>{currentEntry.word}</Text>
        {currentEntry.value !== 1 && (
          <Text variant="titleLarge" style={styles.wordScore}>{currentEntry.value}</Text>
        )}
      </Surface>

      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={handleSkip}
          contentStyle={styles.actionBtnContent}
          labelStyle={styles.actionBtnLabel}
        >
          Skip
        </Button>
        <Button
          mode="contained"
          onPress={handleGuessed}
          contentStyle={styles.actionBtnContent}
          labelStyle={styles.actionBtnLabel}
        >
          Got It!
        </Button>
      </View>

      {freeSkipsRemaining !== null && (
        <Text variant="bodyMedium" style={styles.skipsRemaining}>
          Free skips: {freeSkipsRemaining}
        </Text>
      )}

      <View style={styles.bottomBar}>
        <View style={styles.bottomSpacer} />
        <Text variant="displaySmall" style={styles.roundScore}>{roundScore}</Text>
        <IconButton
          icon="pause"
          mode="contained-tonal"
          size={28}
          style={styles.pauseButton}
          onPress={() =>
            navigation.navigate('Pause', {
              currentTeam,
              currentPlayer,
              timeLeft,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f6f2ff',
  },
  timer: {
    fontWeight: 'bold',
    color: '#1c1b1f',
  },
  wordCard: {
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  word: {
    fontWeight: 'bold',
    color: '#1c1b1f',
  },
  wordScore: {
    color: '#79747e',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtnContent: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  actionBtnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipsRemaining: {
    color: '#79747e',
  },
  bottomBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSpacer: {
    width: 50,
  },
  roundScore: {
    fontWeight: 'bold',
    color: '#1c1b1f',
  },
  pauseButton: {
    backgroundColor: '#e8def8',
  },
  countdownContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f2ff',
  },
  countdownCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontWeight: 'bold',
    color: '#6750A4',
  },
});
