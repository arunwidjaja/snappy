import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PlayedWord } from '../navigation/types';
import { WORDS } from '../data/words';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

function getRandomWord(currentWord: string): string {
  let next = currentWord;
  while (next === currentWord) {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return next;
}

export default function GameplayScreen({ navigation, route }: Props) {
  const { teams, currentTeamIndex, scores, scoreLimit, duration, skipPenalty, freeSkips } =
    route.params;
  const currentTeam = teams[currentTeamIndex];

  const [word, setWord] = useState(() => getRandomWord(''));
  const [playedWords, setPlayedWords] = useState<PlayedWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [paused, setPaused] = useState(false);
  const [confirmingQuit, setConfirmingQuit] = useState(false);
  const playedWordsRef = useRef<PlayedWord[]>([]);

  // Keep ref in sync so the timer callback always sees the latest list
  useEffect(() => {
    playedWordsRef.current = playedWords;
  }, [playedWords]);

  const roundScore = playedWords.filter(w => w.gotIt).length;

  // Countdown timer
  useEffect(() => {
    if (paused) return;

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
  }, [paused]);

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
    setPlayedWords(prev => [...prev, { word, gotIt: false }]);
    setWord(prev => getRandomWord(prev));
  }, [word]);

  const handleGotIt = useCallback(() => {
    setPlayedWords(prev => [...prev, { word, gotIt: true }]);
    setWord(prev => getRandomWord(prev));
  }, [word]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, '0')}`;

  if (paused) {
    return (
      <View style={styles.container}>
        <Text style={styles.pausedTitle}>Paused</Text>
        <Text style={styles.timer}>{timerDisplay}</Text>
        <View style={styles.pauseButtons}>
          <Button title="Resume" onPress={() => setPaused(false)} />
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

  return (
    <View style={styles.container}>
      <Text style={styles.teamName}>{currentTeam}'s Turn</Text>
      <Text style={styles.score}>Score: {roundScore}</Text>
      <Text style={styles.timer}>{timerDisplay}</Text>
      <Text style={styles.word}>{word}</Text>
      <View style={styles.buttonRow}>
        <Button title="Skip" onPress={handleSkip} />
        <Button title="Got It!" onPress={handleGotIt} />
      </View>
      <Button title="Pause" onPress={() => setPaused(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  teamName: { fontSize: 22, fontWeight: '600', marginBottom: 10, color: '#555' },
  score: { fontSize: 18, color: '#333', marginBottom: 10 },
  timer: { fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  word: { fontSize: 42, fontWeight: 'bold', marginBottom: 40 },
  buttonRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  pausedTitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  pauseButtons: { gap: 15, marginTop: 20 },
  confirmRow: { alignItems: 'center' as const, gap: 10 },
  confirmText: { fontSize: 16, fontWeight: '600' as const, marginBottom: 5 },
});
