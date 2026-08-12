import { useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee, Zap, Moon } from "lucide-react"
import { useAppState, useAppDispatch } from "../../store/AppContext"
import { cn } from "../../lib/utils"

const MODES = [
  { key: "focus" as const, label: "Focus", icon: Zap, color: "text-primary" },
  { key: "short-break" as const, label: "Short", icon: Coffee, color: "text-success" },
  { key: "long-break" as const, label: "Long", icon: Moon, color: "text-accent" },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export default function Timer() {
  const { timer, settings } = useAppState()
  const dispatch = useAppDispatch()

  const totalTime =
    timer.mode === "focus"
      ? settings.focusDuration
      : timer.mode === "short-break"
        ? settings.shortBreakDuration
        : settings.longBreakDuration

  const progress = ((totalTime - timer.timeLeft) / totalTime) * 100

  useEffect(() => {
    if (!timer.isRunning || timer.timeLeft > 0) return

    const audio = new Audio(
      "data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAACAgICAgICAgICAgICAgICAgICAgICAgICA"
    )
    audio.play().catch(() => {})
    dispatch({ type: "COMPLETE_SESSION" })
  }, [timer.timeLeft, timer.isRunning, dispatch])

  useEffect(() => {
    if (!timer.isRunning) return

    const interval = setInterval(() => {
      dispatch({ type: "TICK" })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer.isRunning, dispatch])

  const circumference = 2 * Math.PI * 56
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-1">
        {MODES.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => dispatch({ type: "SET_MODE", mode: key })}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              timer.mode === key
                ? "bg-surface-hover text-text"
                : "text-text-muted hover:text-text hover:bg-surface"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", timer.mode === key && color)} />
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-[100px] h-[100px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={cn(
              timer.mode === "focus"
                ? "text-primary"
                : timer.mode === "short-break"
                  ? "text-success"
                  : "text-accent"
            )}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-mono font-bold tracking-tight text-text">
            {formatTime(timer.timeLeft)}
          </span>
          <span className="text-[10px] text-text-muted">
            #{timer.sessionsCompleted + 1}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            dispatch({ type: timer.isRunning ? "PAUSE_TIMER" : "START_TIMER" })
          }
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors",
            timer.mode === "focus"
              ? "bg-primary hover:bg-primary-hover"
              : timer.mode === "short-break"
                ? "bg-success hover:opacity-90"
                : "bg-accent hover:bg-accent-hover"
          )}
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Start
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "RESET_TIMER" })}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-muted bg-surface hover:bg-surface-hover transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </motion.button>
      </div>
    </div>
  )
}
