export type GameRulesParams = {
  teams: string[];
  scoreLimit: number;
  duration: number;
  skipPenalty: number;
  freeSkips: number;
};

export type GameState = GameRulesParams & {
  currentTeamIndex: number;
  scores: number[];
};

export type RootStackParamList = {
  Home: undefined;
  AddTeams: undefined;
  GameRules: { teams: string[] };
  Gameplay: GameState;
  RoundResults: GameState & { roundScore: number };
  Scoreboard: { teams: string[]; scores: number[] };
};
