import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/Title';
import AddTeamsScreen from '../screens/Teams';
import GameRulesScreen from '../screens/Rules';
import GameplayScreen from '../screens/Game';
import RoundResultsScreen from '../screens/RoundResultsScreen';
import ScoreboardScreen from '../screens/Scoreboard';
import PauseScreen from '../screens/Pause';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator id="RootStack" initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="AddTeams"
        component={AddTeamsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameRules"
        component={GameRulesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Gameplay"
        component={GameplayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pause"
        component={PauseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoundResults"
        component={RoundResultsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Scoreboard"
        component={ScoreboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
