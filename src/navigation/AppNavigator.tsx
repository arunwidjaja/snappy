import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import AddTeamsScreen from '../screens/AddTeamsScreen';
import GameRulesScreen from '../screens/GameRulesScreen';
import GameplayScreen from '../screens/GameplayScreen';
import RoundResultsScreen from '../screens/RoundResultsScreen';
import ScoreboardScreen from '../screens/ScoreboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator id="RootStack" initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Snappy' }}
      />
      <Stack.Screen
        name="AddTeams"
        component={AddTeamsScreen}
        options={{ title: 'Add Teams' }}
      />
      <Stack.Screen
        name="GameRules"
        component={GameRulesScreen}
        options={{ title: 'Game Rules' }}
      />
      <Stack.Screen
        name="Gameplay"
        component={GameplayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoundResults"
        component={RoundResultsScreen}
        options={{ title: 'Round Results' }}
      />
      <Stack.Screen
        name="Scoreboard"
        component={ScoreboardScreen}
        options={{ title: 'Scoreboard' }}
      />
    </Stack.Navigator>
  );
}
