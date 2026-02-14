import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
    const players = Array.from({ length: newPlayerCount }, (_, i) => `${trimmed}Player${i + 1}`);
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
        <View style={[styles.teamCard, isActive && styles.teamRowActive]}>
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive || isEditing}
            style={styles.teamRow}
          >
            <Text style={styles.dragHandle}>{'\u2261'}</Text>

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
                <Text style={styles.teamName}>{item.name}</Text>
                <Text style={styles.editIcon}>{'\u270E'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => removeTeam(item.key)}>
              <Text style={styles.removeBtn}>{'\u2715'}</Text>
            </TouchableOpacity>
            <Text style={styles.playerCountLabel}>
              {item.players.length} {item.players.length === 1 ? 'player' : 'players'}
            </Text>
          </TouchableOpacity>

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
                      <Text style={styles.playerName}>{player}</Text>
                      <Text style={styles.editIcon}>{'\u270E'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Teams</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={teamName}
          onChangeText={setTeamName}
          onSubmitEditing={addTeam}
        />
        <View style={styles.playerCountPicker}>
          <TouchableOpacity
            style={styles.playerCountBtn}
            onPress={() => setNewPlayerCount((c) => Math.max(1, c - 1))}
          >
            <Text style={styles.playerCountBtnText}>{'\u2212'}</Text>
          </TouchableOpacity>
          <Text style={styles.playerCountValue}>{newPlayerCount}</Text>
          <TouchableOpacity
            style={styles.playerCountBtn}
            onPress={() => setNewPlayerCount((c) => Math.min(99, c + 1))}
          >
            <Text style={styles.playerCountBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Button title="Add Team" onPress={addTeam} />
      </View>

      <DraggableFlatList
        data={teams}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={({ data }) => setTeams(data)}
        containerStyle={styles.list}
        extraData={`${editingKey}-${editingPlayerKey}`}
      />

      {!canContinue && teams.length > 0 && (
        <Text style={styles.hint}>Add at least 2 teams to continue</Text>
      )}

      <Button
        title="Continue"
        disabled={!canContinue}
        onPress={() =>
          navigation.navigate('GameRules', {
            teams: teams.map((t) => t.name),
            players: teams.map((t) => t.players),
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  list: { flex: 1, marginBottom: 15 },
  teamCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  teamRowActive: {
    backgroundColor: '#f0f0f0',
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
  },
  dragHandle: { fontSize: 22, color: '#999', marginRight: 12 },
  teamName: { fontSize: 16, flex: 1 },
  nameContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  editIcon: { fontSize: 14, color: '#999', marginLeft: 6 },
  editInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    padding: 4,
    fontSize: 16,
  },
  playerCountPicker: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: 10,
  },
  playerCountBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  playerCountBtnText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#555',
  },
  playerCountValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    minWidth: 28,
    textAlign: 'center' as const,
  },
  playerCountLabel: {
    fontSize: 13,
    color: '#888',
    marginRight: 8,
  },
  playerList: {
    paddingLeft: 46,
    paddingBottom: 8,
  },
  playerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 4,
  },
  playerName: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  removeBtn: { fontSize: 18, color: '#e33', paddingHorizontal: 8 },
  hint: { color: '#999', textAlign: 'center', marginBottom: 10 },
});
