import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

interface Props {
  remaining: number;
  total: number;
}

export default function SkipTokens({ remaining, total }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < remaining ? styles.dotFilled : styles.dotEmpty]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotFilled: {
    backgroundColor: '#6750A4',
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  dotEmpty: {
    backgroundColor: '#e0e0e0',
  },
  counter: {
    fontSize: 11,
    fontWeight: '500',
    color: '#79747e',
  },
});
