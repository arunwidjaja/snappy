import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  Switch,
  IconButton,
  Divider,
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GameRules'>;

const SCORE_LIMIT_VALUES = Array.from({ length: 999 }, (_, i) => i + 1);
const DURATION_VALUES = Array.from({ length: 199 }, (_, i) => (i + 1) * 5);
const FREE_SKIPS = [0, 1, 2, 3, 5];

const WHEEL_ITEM_HEIGHT = 44;
const WHEEL_VISIBLE_ITEMS = 3;
const WHEEL_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS;
const WHEEL_PADDING = WHEEL_ITEM_HEIGHT * Math.floor(WHEEL_VISIBLE_ITEMS / 2);

function InlineWheelPicker({
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
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / WHEEL_ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, values.length - 1));
      onChange(values[clamped]);
    },
    [values, onChange],
  );

  const initialIndex = Math.max(0, values.indexOf(value));

  return (
    <View style={styles.wheelSection}>
      <Text variant="labelLarge" style={styles.wheelLabel}>{label}</Text>
      <View style={styles.wheelWrapper}>
        <View style={styles.wheelHighlight} pointerEvents="none" />
        <FlatList
          data={values}
          keyExtractor={(item) => String(item)}
          showsVerticalScrollIndicator={false}
          snapToInterval={WHEEL_ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
          getItemLayout={(_, index) => ({
            length: WHEEL_ITEM_HEIGHT,
            offset: WHEEL_ITEM_HEIGHT * index,
            index,
          })}
          initialScrollIndex={initialIndex}
          contentContainerStyle={{
            paddingVertical: WHEEL_PADDING,
          }}
          renderItem={({ item }) => {
            const isSelected = item === value;
            return (
              <View style={styles.wheelItem}>
                <Text
                  style={[
                    styles.wheelItemText,
                    isSelected && styles.wheelItemTextSelected,
                  ]}
                >
                  {formatLabel(item)}
                </Text>
              </View>
            );
          }}
        />
      </View>
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
    <View style={styles.settingRow}>
      <View style={styles.settingRowInner}>
        <Text variant="bodyLarge" style={styles.settingLabel}>{label}</Text>
        <View style={styles.cycleControls}>
          <IconButton icon="chevron-left" size={24} onPress={prev} />
          <Text variant="titleMedium" style={styles.cycleValue}>{format(value)}</Text>
          <IconButton icon="chevron-right" size={24} onPress={next} />
        </View>
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
      <Text variant="headlineMedium" style={styles.heading}>Game Rules</Text>

      <Surface style={styles.card} elevation={2}>
        <View style={styles.wheelsRow}>
          <InlineWheelPicker
            label="Score Limit"
            values={SCORE_LIMIT_VALUES}
            value={scoreLimit}
            formatLabel={(v) => String(v)}
            onChange={setScoreLimit}
          />

          <View style={styles.wheelDivider} />

          <InlineWheelPicker
            label="Round Duration"
            values={DURATION_VALUES}
            value={duration}
            formatLabel={(v) => String(v)}
            onChange={setDuration}
          />
        </View>
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <View style={styles.settingRow}>
          <View style={styles.settingRowInner}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" style={styles.settingLabel}>Free Skips</Text>
              <Text variant="bodySmall" style={styles.settingHint}>
                {freeSkips ? 'Skips have no penalty' : `${freeSkipCount} free, then -1 per skip`}
              </Text>
            </View>
            <Switch value={freeSkips} onValueChange={setFreeSkips} />
          </View>
        </View>

        {!freeSkips && (
          <>
            <Divider style={styles.divider} />
            <CyclePicker
              label="Free Skips"
              values={FREE_SKIPS}
              value={freeSkipCount}
              format={(v) => String(v)}
              onChange={setFreeSkipCount}
            />
          </>
        )}
      </Surface>

      <View style={styles.startBtn}>
        <Button
          mode="contained"
          contentStyle={styles.startBtnContent}
          labelStyle={styles.startBtnLabel}
          onPress={() =>
            navigation.navigate('ReadyUp', {
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
        >
          Start Game
        </Button>
      </View>
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
    marginBottom: 24,
    color: '#1c1b1f',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  wheelsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  wheelDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  wheelSection: {
    flex: 1,
    alignItems: 'center',
  },
  wheelLabel: {
    color: '#79747e',
    marginBottom: 8,
    fontWeight: '600',
  },
  wheelWrapper: {
    height: WHEEL_HEIGHT,
    overflow: 'hidden',
    width: '100%',
  },
  wheelHighlight: {
    position: 'absolute',
    top: WHEEL_PADDING,
    left: 16,
    right: 16,
    height: WHEEL_ITEM_HEIGHT,
    backgroundColor: '#f3edf7',
    borderRadius: 12,
    zIndex: 1,
  },
  wheelItem: {
    height: WHEEL_ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  wheelItemText: {
    color: '#79747e',
    fontSize: 18,
  },
  wheelItemTextSelected: {
    color: '#6750A4',
    fontWeight: 'bold',
    fontSize: 22,
  },
  settingRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontWeight: '600',
    color: '#1c1b1f',
  },
  settingHint: {
    color: '#79747e',
    marginTop: 2,
  },
  divider: {
    marginHorizontal: 16,
  },
  cycleControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleValue: {
    minWidth: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6750A4',
  },
  startBtn: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  startBtnContent: {
    paddingVertical: 8,
  },
  startBtnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
