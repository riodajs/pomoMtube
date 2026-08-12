import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FileText, Copy, Check } from "lucide-react"
import { useAppState, useAppDispatch } from "../../store/AppContext"

export default function Notes() {
  const { notes } = useAppState()
  const dispatch = useAppDispatch()
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const active = notes.find((n) => n.id === activeNote)

  const copyNote = (id: string, content: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Notes</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "ADD_NOTE", content: "" })}
          className="bg-primary hover:bg-primary-hover text-white p-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {active ? (
        <div className="flex flex-col gap-2 flex-1">
          <textarea
            value={active.content}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_NOTE",
                id: active.id,
                content: e.target.value,
              })
            }
            placeholder="Start writing..."
            className="flex-1 bg-background border border-border rounded-lg p-3 text-xs text-text placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveNote(null)}
              className="text-[10px] text-text-muted hover:text-text transition-colors"
            >
              Back to list
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => copyNote(active.id, active.content, { stopPropagation: () => {} } as any)}
                className="text-[10px] text-text-muted hover:text-text transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button
                onClick={() => {
                  dispatch({ type: "DELETE_NOTE", id: active.id })
                  setActiveNote(null)
                }}
                className="text-[10px] text-text-muted hover:text-primary transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-background group transition-colors hover:bg-surface-hover"
              >
                <button
                  onClick={() => setActiveNote(note.id)}
                  className="flex items-start gap-2 flex-1 text-left min-w-0"
                >
                  <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text-muted" />
                  <span className="text-xs text-text-muted truncate">
                    {note.content || "Empty note"}
                  </span>
                </button>
                {note.content && (
                  <button
                    onClick={(e) => copyNote(note.id, note.content, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-text transition-all shrink-0"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <p className="text-center text-text-muted text-xs py-4">
              No notes yet
            </p>
          )}
        </div>
      )}
    </div>
  )
}
