import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PlayedWord } from '../navigation/types';
import { WORDS, WordEntry } from '../data/words';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

function getRandomEntry(currentWord: string): WordEntry {
  let next = WORDS[Math.floor(Math.random() * WORDS.length)];
  while (next.word === currentWord) {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return next;
}

export default function GameplayScreen({ navigation, route }: Props) {
  const { teams, currentTeamIndex, scores, scoreLimit, duration, skipPenalty, freeSkips } =
    route.params;
  const currentTeam = teams[currentTeamIndex];

  const [currentEntry, setCurrentEntry] = useState(() => getRandomEntry(''));
  const [playedWords, setPlayedWords] = useState<PlayedWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isFocused, setIsFocused] = useState(true);
  const playedWordsRef = useRef<PlayedWord[]>([]);

  // Keep ref in sync so the timer callback always sees the latest list
  useEffect(() => {
    playedWordsRef.current = playedWords;
  }, [playedWords]);

  const roundScore = playedWords.reduce((sum, w) => sum + (w.guessed ? w.value : 0), 0);

  // Pause/resume timer based on screen focus
  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setIsFocused(true);
    });
    const unsubBlur = navigation.addListener('blur', () => {
      setIsFocused(false);
    });
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  // Countdown timer
  useEffect(() => {
    if (!isFocused) return;

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
  }, [isFocused]);

  // Navigate to results when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.replace('RoundResults', {
        teams,
        currentTeamIndex,
        scores,
        scoreLimit,
        duration,
        skipPenalty,
        freeSkips,
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

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timerDisplay}</Text>

      <Text style={styles.word}>{currentEntry.word}</Text>

      <View style={styles.buttonRow}>
        <Button title="Skip" onPress={handleSkip} />
        <Button title="Got It!" onPress={handleGuessed} />
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomSpacer} />
        <Text style={styles.roundScore}>{roundScore}</Text>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={() =>
            navigation.navigate('Pause', {
              currentTeam,
              roundScore,
              timeLeft,
              duration,
              teams,
              scores,
            })
          }
        >
          <Text style={styles.pauseButtonText}>{'\u23F8'}</Text>
        </TouchableOpacity>
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
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  word: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonText: {
    fontSize: 24,
  },
});
