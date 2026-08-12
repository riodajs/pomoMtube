import { motion } from "framer-motion"
import { Timer as TimerIcon } from "lucide-react"
import TimerComponent from "./components/timer/Timer"
import Tasks from "./components/tasks/Tasks"
import Notes from "./components/notes/Notes"
import MusicPlayer from "./components/music/MusicPlayer"

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <TimerIcon className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-text tracking-tight">
            pomoMtube
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl border border-border px-5 py-3 flex justify-center"
            >
              <TimerComponent />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-2xl border border-border p-4 flex-1 min-h-[300px]"
            >
              <MusicPlayer />
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-surface rounded-2xl border border-border p-4 flex-1"
            >
              <Tasks />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-2xl border border-border p-4 flex-1"
            >
              <Notes />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
