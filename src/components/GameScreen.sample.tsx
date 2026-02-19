import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipForward, Check } from "lucide-react";
import GameTimer from "./GameTimer";
import SkipTokens from "./SkipTokens";
const WORDS = [
  "Elephant", "Skateboard", "Volcano", "Astronaut", "Pirate",
  "Thunderstorm", "Jellyfish", "Helicopter", "Pancake", "Wizard",
  "Dinosaur", "Surfboard", "Avalanche", "Penguin", "Fireworks",
];
const TOTAL_TIME = 60;
const TOTAL_SKIPS = 5;
const GameScreen = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isPaused, setIsPaused] = useState(false);
  const [skipsRemaining, setSkipsRemaining] = useState(TOTAL_SKIPS);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);
  const nextWord = useCallback(() => {
    setCurrentWordIndex((i) => (i + 1) % WORDS.length);
  }, []);
  const handleSkip = () => {
    if (skipsRemaining > 0 && !isPaused && timeLeft > 0) {
      setSkipsRemaining((s) => s - 1);
      nextWord();
    }
  };
  const handleGotIt = () => {
    if (!isPaused && timeLeft > 0) {
      setScore((s) => s + 1);
      nextWord();
    }
  };
  const isGameOver = timeLeft <= 0;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      {/* Score */}
      <motion.div
        className="mb-2 text-sm font-semibold tracking-widest uppercase text-muted-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Score: <span className="text-accent text-glow-accent">{score}</span>
      </motion.div>
      {/* Timer */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <GameTimer timeLeft={timeLeft} totalTime={TOTAL_TIME} />
      </motion.div>
      {/* Word Display */}
      <div className="my-8 min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isGameOver ? (
            <motion.div
              key="gameover"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-primary text-glow-primary">
                Time's Up!
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Final Score: <span className="text-accent font-bold">{score}</span>
              </p>
            </motion.div>
          ) : (
            <motion.h1
              key={currentWordIndex}
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-5xl font-extrabold tracking-tight text-foreground text-center"
            >
              {isPaused ? (
                <span className="text-muted-foreground text-3xl">Paused</span>
              ) : (
                WORDS[currentWordIndex]
              )}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
      {/* Skip Tokens */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SkipTokens remaining={skipsRemaining} total={TOTAL_SKIPS} />
      </motion.div>
      {/* Action Buttons */}
      {!isGameOver && (
        <motion.div
          className="flex items-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Skip */}
          <button
            onClick={handleSkip}
            disabled={skipsRemaining <= 0 || isPaused}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <SkipForward className="h-6 w-6" />
          </button>
          {/* Got It */}
          <motion.button
            onClick={handleGotIt}
            disabled={isPaused}
            whileTap={{ scale: 0.92 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: "var(--glow-secondary)" }}
          >
            <Check className="h-9 w-9" strokeWidth={3} />
          </motion.button>
          {/* Pause */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
          >
            {isPaused ? (
              <Play className="h-6 w-6" />
            ) : (
              <Pause className="h-6 w-6" />
            )}
          </button>
        </motion.div>
      )}
      {/* Play Again */}
      {isGameOver && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTimeLeft(TOTAL_TIME);
            setSkipsRemaining(TOTAL_SKIPS);
            setScore(0);
            setCurrentWordIndex(0);
            setIsPaused(false);
          }}
          className="mt-4 rounded-2xl bg-primary px-8 py-3 text-lg font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
          style={{ boxShadow: "var(--glow-primary)" }}
        >
          Play Again
        </motion.button>
      )}
    </div>
  );
};
export default GameScreen;