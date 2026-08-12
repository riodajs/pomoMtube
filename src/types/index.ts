export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export interface Note {
  id: string
  content: string
  createdAt: number
  updatedAt: number
}

export type TimerMode = "focus" | "short-break" | "long-break"

export interface TimerState {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  sessionsCompleted: number
}

export interface AppState {
  timer: TimerState
  tasks: Task[]
  notes: Note[]
  settings: {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsBeforeLongBreak: number
  }
}
