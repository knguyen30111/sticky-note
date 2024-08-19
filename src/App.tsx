import React, { useState, useCallback } from "react";
import StickyNote from "./components/StickyNote";

interface Note {
  id: number;
  content: string;
  color: string;
  zIndex: number;
  x: number;
  y: number;
}

const generatePastelColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 85%)`;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

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
        x: 100,
        y: 100,
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

  const updateNotePosition = useCallback((id: number, x: number, y: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, x, y } : note))
    );
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prevZoom) => Math.max(0.1, Math.min(prevZoom + delta, 3)));
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full"
        onWheel={(e) => handleZoom(e.deltaY * -0.001)}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "0 0",
          width: `${100 / zoomLevel}%`,
          height: `${100 / zoomLevel}%`,
        }}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            initialContent={note.content}
            onDelete={() => deleteNote(note.id)}
            color={note.color}
            zIndex={note.zIndex}
            onFocus={() => bringToFront(note.id)}
            x={note.x}
            y={note.y}
            updatePosition={updateNotePosition}
            zoomLevel={zoomLevel}
          />
        ))}
      </div>
      <div className="absolute top-4 left-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={addNote}
        >
          Add Note
        </button>
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => handleZoom(0.1)}
        >
          Zoom In
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => handleZoom(-0.1)}
        >
          Zoom Out
        </button>
      </div>
    </div>
  );
};

export default App;
