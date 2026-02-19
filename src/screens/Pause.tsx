import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AwesomeButton from "react-native-really-awesome-button";

type Props = NativeStackScreenProps<RootStackParamList, 'Pause'>;

export default function PauseScreen({ navigation, route }: Props) {
  const { currentTeam, currentPlayer, timeLeft } = route.params;
  const [confirmingQuit, setConfirmingQuit] = useState(false);
  const { width } = useWindowDimensions();
  const buttonWidth = width - 40;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.teamTurn}>
          {currentTeam}'s Turn — {currentPlayer}
        </Text>
        <Text variant="displaySmall" style={styles.timer}>{timerDisplay}</Text>
      </Surface>

      <View style={styles.buttonsSection}>
        <AwesomeButton
          width={buttonWidth}
          height={70}
          backgroundColor="#6750a4"
          backgroundDarker="#4a3780"
          borderRadius={12}
          onPress={() => navigation.goBack()}
        >
          Resume
        </AwesomeButton>

        {confirmingQuit ? (
          <Surface style={styles.confirmCard} elevation={1}>
            <Text variant="titleSmall" style={styles.confirmText}>Quit game?</Text>
            <View style={styles.confirmRow}>
              <Button
                mode="contained"
                buttonColor="#c62828"
                textColor="#fff"
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
                }
              >
                Yes, Quit
              </Button>
              <Button mode="outlined" onPress={() => setConfirmingQuit(false)}>
                Cancel
              </Button>
            </View>
          </Surface>
        ) : (
          <AwesomeButton
            width={buttonWidth}
            height={50}
            backgroundColor="#c62828"
            backgroundDarker="#8b0000"
            borderRadius={12}
            onPress={() => setConfirmingQuit(true)}
          >
            Quit Game
          </AwesomeButton>
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
    backgroundColor: '#f6f2ff',
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 40,
  },
  teamTurn: {
    color: '#79747e',
    marginBottom: 8,
  },
  timer: {
    fontWeight: 'bold',
    color: '#1c1b1f',
  },
  buttonsSection: {
    gap: 16,
    alignItems: 'center',
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
