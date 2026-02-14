import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GameRules'>;

const SCORE_LIMIT_VALUES = Array.from({ length: 999 }, (_, i) => i + 1);
const DURATION_VALUES = Array.from({ length: 199 }, (_, i) => (i + 1) * 5);
const FREE_SKIPS = [0, 1, 2, 3, 5];

function DropdownPicker({
  label,
  values,
  value,
  formatLabel,
  onChange,
}: {
  label: string;
  values: number[];
  value: number;
  formatLabel: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownRow}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setOpen(true)}>
        <Text style={styles.dropdownButtonText}>{formatLabel(value)}</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={values}
              keyExtractor={(item) => String(item)}
              initialScrollIndex={Math.max(0, values.indexOf(value))}
              getItemLayout={(_, index) => ({
                length: 48,
                offset: 48 * index,
                index,
              })}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item === value && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === value && styles.modalItemTextSelected,
                    ]}
                  >
                    {formatLabel(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function CyclePicker({
  label,
  values,
  value,
  format,
  onChange,
}: {
  label: string;
  values: number[];
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const idx = values.indexOf(value);

  const prev = () => {
    const next = idx > 0 ? idx - 1 : values.length - 1;
    onChange(values[next]);
  };

  const next = () => {
    const nextIdx = idx < values.length - 1 ? idx + 1 : 0;
    onChange(values[nextIdx]);
  };

  return (
    <View style={styles.pickerRow}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.pickerControls}>
        <Button title="<" onPress={prev} />
        <Text style={styles.pickerValue}>{format(value)}</Text>
        <Button title=">" onPress={next} />
      </View>
    </View>
  );
}

export default function GameRulesScreen({ navigation, route }: Props) {
  const { teams, players } = route.params;

  const [scoreLimit, setScoreLimit] = useState(45);
  const [duration, setDuration] = useState(60);
  const [freeSkips, setFreeSkips] = useState(true);
  const [freeSkipCount, setFreeSkipCount] = useState(3);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Game Rules</Text>

      <DropdownPicker
        label="Score Limit"
        values={SCORE_LIMIT_VALUES}
        value={scoreLimit}
        formatLabel={(v) => String(v)}
        onChange={setScoreLimit}
      />

      <DropdownPicker
        label="Round Duration"
        values={DURATION_VALUES}
        value={duration}
        formatLabel={(v) => `${v}s`}
        onChange={setDuration}
      />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Free Skips</Text>
        <TouchableOpacity
          style={[styles.toggle, freeSkips && styles.toggleOn]}
          onPress={() => setFreeSkips(prev => !prev)}
        >
          <Text style={styles.toggleText}>{freeSkips ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>

      {!freeSkips && (
        <CyclePicker
          label="Free Skips"
          values={FREE_SKIPS}
          value={freeSkipCount}
          format={(v) => String(v)}
          onChange={setFreeSkipCount}
        />
      )}

      <View style={styles.startBtn}>
        <Button
          title="Start Game"
          onPress={() =>
            navigation.navigate('Gameplay', {
              teams,
              players,
              scoreLimit,
              duration,
              freeSkips,
              freeSkipCount,
              currentTeamIndex: 0,
              currentPlayerIndices: teams.map(() => 0),
              scores: teams.map(() => 0),
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownLabel: { fontSize: 16, fontWeight: '600', flex: 1 },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  dropdownButtonText: { fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '70%',
    maxHeight: '60%',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  modalItem: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#e8f0fe',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalItemTextSelected: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerLabel: { fontSize: 16, fontWeight: '600', flex: 1 },
  pickerControls: { flexDirection: 'row', alignItems: 'center' },
  pickerValue: { fontSize: 18, fontWeight: 'bold', minWidth: 50, textAlign: 'center' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: { fontSize: 16, fontWeight: '600', flex: 1 },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  toggleOn: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  startBtn: { marginTop: 'auto', paddingBottom: 20 },
});
