export type GameRulesParams = {
  teams: string[];
  players: string[][];
  scoreLimit: number;
  duration: number;
  freeSkips: boolean;
  freeSkipCount: number;
};

export type GameState = GameRulesParams & {
  currentTeamIndex: number;
  currentPlayerIndices: number[];
  scores: number[];
};

export type PlayedWord = {
  word: string;
  value: number;
  guessed: boolean;
};

export type PauseParams = {
  currentTeam: string;
  currentPlayer: string;
  timeLeft: number;
};

export type RootStackParamList = {
  Home: undefined;
  AddTeams: undefined;
  GameRules: { teams: string[]; players: string[][] };
  ReadyUp: GameState;
  Gameplay: GameState;
  Pause: PauseParams;
  RoundResults: GameState & { playedWords: PlayedWord[] };
  Scoreboard: { teams: string[]; players: string[][]; scores: number[] };
};
