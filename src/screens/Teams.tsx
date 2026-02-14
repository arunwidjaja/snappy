import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text, Button, Surface, IconButton, Divider } from 'react-native-paper';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTeams'>;

type TeamItem = { key: string; name: string; players: string[] };

let nextKey = 0;

export default function AddTeamsScreen({ navigation }: Props) {
  const [teamName, setTeamName] = useState('');
  const [newPlayerCount, setNewPlayerCount] = useState(2);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingPlayerKey, setEditingPlayerKey] = useState<string | null>(null);
  const [editPlayerValue, setEditPlayerValue] = useState('');

  const addTeam = () => {
    const trimmed = teamName.trim();
    if (trimmed.length === 0) return;
    const players = Array.from({ length: newPlayerCount }, (_, i) => `Player ${i + 1}`);
    setTeams((prev) => [...prev, { key: String(nextKey++), name: trimmed, players }]);
    setTeamName('');
    setNewPlayerCount(2);
  };

  const removeTeam = (key: string) => {
    setTeams((prev) => prev.filter((t) => t.key !== key));
  };

  const startEditing = (item: TeamItem) => {
    setEditingKey(item.key);
    setEditValue(item.name);
  };

  const saveEdit = (key: string) => {
    const trimmed = editValue.trim();
    if (trimmed.length > 0) {
      setTeams((prev) =>
        prev.map((t) => (t.key === key ? { ...t, name: trimmed } : t)),
      );
    }
    setEditingKey(null);
    setEditValue('');
  };

  const startEditingPlayer = (teamKey: string, playerIndex: number) => {
    const team = teams.find((t) => t.key === teamKey);
    if (!team) return;
    setEditingPlayerKey(`${teamKey}-${playerIndex}`);
    setEditPlayerValue(team.players[playerIndex]);
  };

  const savePlayerEdit = (teamKey: string, playerIndex: number) => {
    const trimmed = editPlayerValue.trim();
    if (trimmed.length > 0) {
      setTeams((prev) =>
        prev.map((t) => {
          if (t.key !== teamKey) return t;
          const updated = [...t.players];
          updated[playerIndex] = trimmed;
          return { ...t, players: updated };
        }),
      );
    }
    setEditingPlayerKey(null);
    setEditPlayerValue('');
  };

  const canContinue = teams.length >= 2;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TeamItem>) => {
    const isEditing = editingKey === item.key;

    return (
      <ScaleDecorator>
        <Surface
          style={[styles.teamCard, isActive && styles.teamCardActive]}
          elevation={isActive ? 4 : 1}
        >
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive || isEditing}
            style={styles.teamRow}
          >
            <IconButton icon="drag" size={20} iconColor="#79747e" style={styles.dragHandle} />

            {isEditing ? (
              <TextInput
                style={[styles.teamName, styles.editInput]}
                value={editValue}
                onChangeText={setEditValue}
                onSubmitEditing={() => saveEdit(item.key)}
                onBlur={() => saveEdit(item.key)}
                autoFocus
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity
                style={styles.nameContainer}
                onPress={() => startEditing(item)}
              >
                <Text variant="titleMedium" style={styles.teamName}>{item.name}</Text>
                <IconButton icon="pencil" size={16} iconColor="#79747e" style={styles.editIcon} />
              </TouchableOpacity>
            )}
            <IconButton
              icon="close"
              size={18}
              iconColor="#c62828"
              onPress={() => removeTeam(item.key)}
              style={styles.removeBtn}
            />
          </TouchableOpacity>

          <Divider style={styles.playerDivider} />

          <View style={styles.playerList}>
            {item.players.map((player, index) => {
              const playerKey = `${item.key}-${index}`;
              const isEditingPlayer = editingPlayerKey === playerKey;

              return (
                <View key={playerKey} style={styles.playerRow}>
                  {isEditingPlayer ? (
                    <TextInput
                      style={[styles.playerName, styles.editInput]}
                      value={editPlayerValue}
                      onChangeText={setEditPlayerValue}
                      onSubmitEditing={() => savePlayerEdit(item.key, index)}
                      onBlur={() => savePlayerEdit(item.key, index)}
                      autoFocus
                      selectTextOnFocus
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.nameContainer}
                      onPress={() => startEditingPlayer(item.key, index)}
                    >
                      <Text variant="bodyMedium" style={styles.playerName}>{player}</Text>
                      <IconButton icon="pencil" size={14} iconColor="#79747e" style={styles.editIcon} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </Surface>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Teams</Text>

      <Surface style={styles.inputCard} elevation={2}>
        <TextInput
          style={styles.input}
          value={teamName}
          onChangeText={setTeamName}
          onSubmitEditing={addTeam}
          placeholder="Team name"
          placeholderTextColor="#79747e"
        />
        <View style={styles.inputBottom}>
          <View style={styles.playerCountPicker}>
            <IconButton
              icon="minus"
              size={18}
              mode="contained-tonal"
              onPress={() => setNewPlayerCount((c) => Math.max(1, c - 1))}
              style={styles.playerCountBtn}
            />
            <Text variant="titleMedium" style={styles.playerCountValue}>{newPlayerCount}</Text>
            <IconButton
              icon="plus"
              size={18}
              mode="contained-tonal"
              onPress={() => setNewPlayerCount((c) => Math.min(99, c + 1))}
              style={styles.playerCountBtn}
            />
          </View>
          <Button mode="contained" onPress={addTeam}>Add</Button>
        </View>
      </Surface>

      <DraggableFlatList
        data={teams}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={({ data }) => setTeams(data)}
        containerStyle={styles.list}
        extraData={`${editingKey}-${editingPlayerKey}`}
      />

      <Button
        mode="contained"
        disabled={!canContinue}
        onPress={() =>
          navigation.navigate('GameRules', {
            teams: teams.map((t) => t.name),
            players: teams.map((t) => t.players),
          })
        }
        contentStyle={styles.continueBtnContent}
        labelStyle={styles.continueBtnLabel}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f6f2ff',
  },
  heading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1c1b1f',
  },
  inputCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1c1b1f',
    backgroundColor: '#f6f2ff',
  },
  inputBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  playerCountPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerCountBtn: {
    margin: 0,
  },
  playerCountValue: {
    fontWeight: 'bold',
    minWidth: 28,
    textAlign: 'center',
    color: '#6750A4',
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  teamCard: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    overflow: 'hidden',
  },
  teamCardActive: {
    backgroundColor: '#f3edf7',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 4,
  },
  dragHandle: {
    margin: 0,
  },
  teamName: {
    flex: 1,
    fontWeight: '600',
    color: '#1c1b1f',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    margin: 0,
  },
  editInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#6750A4',
    padding: 4,
    fontSize: 16,
    color: '#1c1b1f',
  },
  removeBtn: {
    margin: 0,
  },
  playerDivider: {
    marginHorizontal: 16,
  },
  playerList: {
    paddingLeft: 48,
    paddingBottom: 10,
    paddingTop: 4,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  playerName: {
    flex: 1,
    color: '#79747e',
  },
  continueBtnContent: {
    paddingVertical: 8,
  },
  continueBtnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
