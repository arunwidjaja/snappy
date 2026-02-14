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

type TeamItem = { key: string; name: string };

let nextKey = 0;

export default function AddTeamsScreen({ navigation }: Props) {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const addTeam = () => {
    const trimmed = teamName.trim();
    if (trimmed.length === 0) return;
    setTeams((prev) => [...prev, { key: String(nextKey++), name: trimmed }]);
    setTeamName('');
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

  const canContinue = teams.length >= 2;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TeamItem>) => {
    const isEditing = editingKey === item.key;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive || isEditing}
          style={[styles.teamRow, isActive && styles.teamRowActive]}
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
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Team Creation</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}

          value={teamName}
          onChangeText={setTeamName}
          onSubmitEditing={addTeam}
        />
        <Button title="Add Team" onPress={addTeam} />
      </View>

      <DraggableFlatList
        data={teams}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={({ data }) => setTeams(data)}
        containerStyle={styles.list}
        extraData={editingKey}
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
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
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
  removeBtn: { fontSize: 18, color: '#e33', paddingHorizontal: 8 },
  hint: { color: '#999', textAlign: 'center', marginBottom: 10 },
});
