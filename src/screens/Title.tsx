import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>SNAPPY</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddTeams')}
        contentStyle={styles.btnContent}
        labelStyle={styles.btnLabel}
      >
        Play
      </Button>
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
  title: {
    fontWeight: 'bold',
    color: '#6750A4',
    marginBottom: 40,
  },
  btnContent: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  btnLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
