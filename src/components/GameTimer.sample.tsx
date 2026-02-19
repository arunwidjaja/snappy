import { motion } from "framer-motion";
interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
}
const GameTimer = ({ timeLeft, totalTime }: GameTimerProps) => {
  const progress = timeLeft / totalTime;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const isLow = timeLeft <= 10;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={isLow ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            filter: isLow
              ? "drop-shadow(0 0 8px hsl(0 72% 55% / 0.6))"
              : "drop-shadow(0 0 8px hsl(16 90% 58% / 0.4))",
          }}
        />
      </svg>
      <motion.span
        className={`absolute text-4xl font-bold tabular-nums ${
          isLow ? "text-destructive" : "text-foreground"
        }`}
        key={timeLeft}
        initial={{ scale: 1.2, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {timeLeft}
      </motion.span>
    </div>
  );
};
export default GameTimer;