import React, { useState } from "react";
import StickyNote from "./components/StickyNote";

interface Note {
  id: number;
  content: string;
  color: string;
  zIndex: number;
}

const generatePastelColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 85%)`;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState<number>(1);

  const addNote = () => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setNotes([
      ...notes,
      {
        id: Date.now(),
        content: "",
        color: generatePastelColor(),
        zIndex: newZIndex,
      },
    ]);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const bringToFront = (id: number) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, zIndex: newZIndex } : note
      )
    );
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100">
      <button
        className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={addNote}
      >
        Add Note
      </button>
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          initialContent={note.content}
          onDelete={() => deleteNote(note.id)}
          color={note.color}
          zIndex={note.zIndex}
          onFocus={() => bringToFront(note.id)}
        />
      ))}
    </div>
  );
};

export default App;
