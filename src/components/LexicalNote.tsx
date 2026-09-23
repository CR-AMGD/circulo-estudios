interface LexicalNoteProps {
  term: string
  definition: string
}

export default function LexicalNote({ term, definition }: LexicalNoteProps) {
  return (
    <span className="inline-block my-2 p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200">
      <strong className="text-amber-400">{term}:</strong> {definition}
    </span>
  )
}