import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react"
import { useAppState, useAppDispatch } from "../../store/AppContext"

export default function Tasks() {
  const { tasks } = useAppState()
  const dispatch = useAppDispatch()
  const [newTask, setNewTask] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTask.trim()
    if (!title) return
    dispatch({ type: "ADD_TASK", title })
    setNewTask("")
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-text">Tasks</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </form>

      <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {pending.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-background hover:bg-surface-hover group transition-colors"
            >
              <button
                onClick={() => dispatch({ type: "TOGGLE_TASK", id: task.id })}
                className="text-text-muted hover:text-success transition-colors shrink-0"
              >
                <Circle className="w-4 h-4" />
              </button>
              <span className="flex-1 text-xs text-text truncate">{task.title}</span>
              <button
                onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-all shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {completed.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">
            Completed
          </span>
          <div className="max-h-[100px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {completed.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-background/50 group"
                >
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_TASK", id: task.id })}
                    className="text-success shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-xs text-text-muted line-through truncate">
                    {task.title}
                  </span>
                  <button
                    onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <p className="text-center text-text-muted text-xs py-4">
          No tasks yet
        </p>
      )}
    </div>
  )
}
