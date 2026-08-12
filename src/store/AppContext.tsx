import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { AppState, TimerMode } from "../types"
import { loadState, saveState } from "../lib/storage"

const DEFAULT_SETTINGS = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsBeforeLongBreak: 4,
}

const INITIAL_STATE: AppState = {
  timer: {
    mode: "focus",
    timeLeft: DEFAULT_SETTINGS.focusDuration,
    isRunning: false,
    sessionsCompleted: 0,
  },
  tasks: [],
  notes: [],
  settings: DEFAULT_SETTINGS,
}

type Action =
  | { type: "START_TIMER" }
  | { type: "PAUSE_TIMER" }
  | { type: "TICK" }
  | { type: "RESET_TIMER" }
  | { type: "SET_MODE"; mode: TimerMode }
  | { type: "COMPLETE_SESSION" }
  | { type: "ADD_TASK"; title: string }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "ADD_NOTE"; content: string }
  | { type: "UPDATE_NOTE"; id: string; content: string }
  | { type: "DELETE_NOTE"; id: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START_TIMER":
      return { ...state, timer: { ...state.timer, isRunning: true } }

    case "PAUSE_TIMER":
      return { ...state, timer: { ...state.timer, isRunning: false } }

    case "TICK":
      if (!state.timer.isRunning) return state
      if (state.timer.timeLeft <= 0) return state
      return { ...state, timer: { ...state.timer, timeLeft: state.timer.timeLeft - 1 } }

    case "RESET_TIMER":
      return {
        ...state,
        timer: {
          ...state.timer,
          timeLeft: state.settings.focusDuration,
          isRunning: false,
        },
      }

    case "SET_MODE":
      return {
        ...state,
        timer: {
          mode: action.mode,
          timeLeft:
            action.mode === "focus"
              ? state.settings.focusDuration
              : action.mode === "short-break"
                ? state.settings.shortBreakDuration
                : state.settings.longBreakDuration,
          isRunning: false,
          sessionsCompleted: state.timer.sessionsCompleted,
        },
      }

    case "COMPLETE_SESSION": {
      const newCount = state.timer.sessionsCompleted + 1
      const isLongBreak = newCount % state.settings.sessionsBeforeLongBreak === 0
      return {
        ...state,
        timer: {
          mode: isLongBreak ? "long-break" : "short-break",
          timeLeft: isLongBreak
            ? state.settings.longBreakDuration
            : state.settings.shortBreakDuration,
          isRunning: false,
          sessionsCompleted: newCount,
        },
      }
    }

    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            title: action.title,
            completed: false,
            createdAt: Date.now(),
          },
        ],
      }

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
      }

    case "ADD_NOTE":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: crypto.randomUUID(),
            content: action.content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      }

    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.id ? { ...n, content: action.content, updatedAt: Date.now() } : n
        ),
      }

    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.id),
      }

    default:
      return state
  }
}

const StateContext = createContext<AppState>(INITIAL_STATE)
const DispatchContext = createContext<React.Dispatch<Action>>(() => {})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) =>
    loadState(init)
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState() {
  return useContext(StateContext)
}

export function useAppDispatch() {
  return useContext(DispatchContext)
}
