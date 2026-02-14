import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pause'>;

export default function PauseScreen({ navigation, route }: Props) {
  const { currentTeam, timeLeft } = route.params;
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.teamTurn}>{currentTeam}'s Turn</Text>
      <Text style={styles.timer}>{timerDisplay}</Text>
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
