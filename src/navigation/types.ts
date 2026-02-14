export type GameRulesParams = {
  teams: string[];
  scoreLimit: number;
  duration: number;
  freeSkips: boolean;
  freeSkipCount: number;
};

export type GameState = GameRulesParams & {
  currentTeamIndex: number;
  scores: number[];
};

export type PlayedWord = {
  word: string;
  value: number;
  guessed: boolean;
};

export type PauseParams = {
  currentTeam: string;
  timeLeft: number;
};

export type RootStackParamList = {
  Home: undefined;
  AddTeams: undefined;
  GameRules: { teams: string[] };
  Gameplay: GameState;
  Pause: PauseParams;
  RoundResults: GameState & { playedWords: PlayedWord[] };
  Scoreboard: { teams: string[]; scores: number[] };
};
