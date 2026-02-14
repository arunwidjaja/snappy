import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={styles.info}>
        <Text style={styles.teamName}>{currentTeam}</Text>
        <Text style={styles.playerName}>{currentPlayer}'s Turn</Text>
      </View>
      <TouchableOpacity
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
      >
        <Text style={styles.playButtonText}>{'\u25B6'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  info: {
    alignItems: 'center',
    marginBottom: 60,
  },
  teamName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 24,
    color: '#666',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 36,
    color: '#fff',
    marginLeft: 4,
  },
});
