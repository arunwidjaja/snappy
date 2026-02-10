import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GameRules'>;

const SCORE_LIMITS = [15, 25, 35, 45, 55, 65, 75];
const DURATIONS = [5, 10, 30, 45, 60, 90, 120];
const SKIP_PENALTIES = [0, 1, 2, 3];
const FREE_SKIPS = [0, 1, 2, 3, 5];

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
  const { teams } = route.params;

  const [scoreLimit, setScoreLimit] = useState(45);
  const [duration, setDuration] = useState(60);
  const [skipPenalty, setSkipPenalty] = useState(0);
  const [freeSkips, setFreeSkips] = useState(3);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Game Rules</Text>

      <CyclePicker
        label="Score Limit"
        values={SCORE_LIMITS}
        value={scoreLimit}
        format={(v) => String(v)}
        onChange={setScoreLimit}
      />

      <CyclePicker
        label="Duration"
        values={DURATIONS}
        value={duration}
        format={(v) => `${v}s`}
        onChange={setDuration}
      />

      <CyclePicker
        label="Skip Penalty"
        values={SKIP_PENALTIES}
        value={skipPenalty}
        format={(v) => (v === 0 ? 'None' : `-${v}`)}
        onChange={setSkipPenalty}
      />

      {skipPenalty !== 0 && (
        <CyclePicker
          label="Free Skips"
          values={FREE_SKIPS}
          value={freeSkips}
          format={(v) => String(v)}
          onChange={setFreeSkips}
        />
      )}

      <View style={styles.startBtn}>
        <Button
          title="Start Game"
          onPress={() =>
            navigation.navigate('Gameplay', {
              teams,
              scoreLimit,
              duration,
              skipPenalty,
              freeSkips,
              currentTeamIndex: 0,
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
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerLabel: { fontSize: 16, fontWeight: '600', flex: 1 },
  pickerControls: { flexDirection: 'row', alignItems: 'center' },
  pickerValue: { fontSize: 18, fontWeight: 'bold', minWidth: 50, textAlign: 'center' },
  startBtn: { marginTop: 'auto', paddingBottom: 20 },
});
