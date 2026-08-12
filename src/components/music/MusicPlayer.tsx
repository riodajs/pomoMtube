import { useState } from "react"
import { motion } from "framer-motion"
import { Music, Play, List } from "lucide-react"

type EmbedSource =
  | { type: "video"; id: string }
  | { type: "playlist"; id: string }
  | null

function parseInput(input: string): EmbedSource {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^PL[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { type: "playlist", id: trimmed }
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: "video", id: trimmed }
  }

  try {
    const url = new URL(trimmed)
    const listId = url.searchParams.get("list")
    if (listId) return { type: "playlist", id: listId }

    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v")
      if (v) return { type: "video", id: v }
    }
    if (url.hostname === "youtu.be") {
      return { type: "video", id: url.pathname.slice(1) }
    }
  } catch {}

  return null
}

function getEmbedSrc(source: EmbedSource): string {
  if (!source) return ""
  if (source.type === "playlist") {
    return `https://www.youtube.com/embed/videoseries?list=${source.id}&controls=1&rel=0&modestbranding=1`
  }
  return `https://www.youtube.com/embed/${source.id}?autoplay=1&controls=1&rel=0&modestbranding=1`
}

export default function MusicPlayer() {
  const [input, setInput] = useState("")
  const [source, setSource] = useState<EmbedSource>(null)
  const [error, setError] = useState(false)

  const load = () => {
    const result = parseInput(input)
    if (result) {
      setSource(result)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <Music className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-text">Music</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Paste YouTube URL, video ID, or playlist..."
          className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={load}
          className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
        </motion.button>
      </div>

      {error && (
        <p className="text-xs text-primary">
          Could not load video. Check the URL or ID.
        </p>
      )}

      {source && (
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          {source.type === "playlist" ? (
            <>
              <List className="w-3 h-3" /> Playlist
            </>
          ) : (
            "Video"
          )}
        </div>
      )}

      <div className="flex-1 rounded-lg overflow-hidden bg-black border border-border">
        {source ? (
          <iframe
            key={getEmbedSrc(source)}
            src={getEmbedSrc(source)}
            className="w-full h-full min-h-[300px]"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs min-h-[300px]">
            No video loaded
          </div>
        )}
      </div>
    </div>
  )
}
