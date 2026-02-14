import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadyUp'>;

export default function ReadyUpScreen({ navigation, route }: Props) {
  const { teams, players, currentTeamIndex, currentPlayerIndices, scores, scoreLimit, duration, freeSkips, freeSkipCount } =
    route.params;
  const currentTeam = teams[currentTeamIndex];
  const currentPlayer = players[currentTeamIndex][currentPlayerIndices[currentTeamIndex]];

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineLarge" style={styles.teamName}>{currentTeam}</Text>
        <Text variant="titleLarge" style={styles.playerName}>{currentPlayer}'s Turn</Text>
      </Surface>

      <IconButton
        icon="play"
        mode="contained"
        size={48}
        containerColor="#6750A4"
        iconColor="#fff"
        style={styles.playButton}
        onPress={() =>
          navigation.replace('Gameplay', {
            teams,
            players,
            currentTeamIndex,
            currentPlayerIndices,
            scores,
            scoreLimit,
            duration,
            freeSkips,
            freeSkipCount,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f6f2ff',
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 48,
  },
  teamName: {
    fontWeight: 'bold',
    color: '#1c1b1f',
    marginBottom: 8,
  },
  playerName: {
    color: '#79747e',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
