import React, { useState, useCallback, useRef, useEffect } from "react";
import { Plus, ZoomIn, ZoomOut } from "lucide-react";
import StickyNote from "./components/StickyNote";

interface Note {
  id: number;
  content: string;
  color: string;
  zIndex: number;
  x: number;
  y: number;
}

interface PanPosition {
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
  const [panPosition, setPanPosition] = useState<PanPosition>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastMousePosition, setLastMousePosition] = useState<PanPosition>({
    x: 0,
    y: 0,
  });
  const dashboardRef = useRef<HTMLDivElement>(null);

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
        x: -panPosition.x + window.innerWidth / (2 * zoomLevel),
        y: -panPosition.y + window.innerHeight / (2 * zoomLevel),
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

  const handleZoom = useCallback(
    (delta: number, clientX: number, clientY: number) => {
      setZoomLevel((prevZoom) => {
        const newZoom = Math.max(0.1, Math.min(prevZoom + delta, 3));
        const zoomPoint = {
          x: (clientX - panPosition.x) / prevZoom,
          y: (clientY - panPosition.y) / prevZoom,
        };
        const newPanPosition = {
          x: -(zoomPoint.x * newZoom - clientX),
          y: -(zoomPoint.y * newZoom - clientY),
        };
        setPanPosition(newPanPosition);
        return newZoom;
      });
    },
    [panPosition]
  );

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) {
      // Right mouse button
      e.preventDefault();
      setIsPanning(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handlePanMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastMousePosition.x;
        const dy = e.clientY - lastMousePosition.y;
        setPanPosition((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setLastMousePosition({ x: e.clientX, y: e.clientY });
      }
    },
    [isPanning, lastMousePosition]
  );

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isPanning) {
        setIsPanning(true);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPanning]);

  return (
    <div
      className="relative h-screen w-screen bg-gray-100 overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={dashboardRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "0 0",
          cursor: isPanning ? "grabbing" : "default",
        }}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onWheel={(e) => handleZoom(e.deltaY * -0.001, e.clientX, e.clientY)}
      >
        <div
          style={{
            transform: `translate(${panPosition.x / zoomLevel}px, ${
              panPosition.y / zoomLevel
            }px)`,
            width: "200%",
            height: "200%",
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
              panPosition={panPosition}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-4 left-4 flex space-x-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
          onClick={addNote}
        >
          <Plus size={24} />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
          onClick={() =>
            handleZoom(0.1, window.innerWidth / 2, window.innerHeight / 2)
          }
        >
          <ZoomIn size={24} />
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
          onClick={() =>
            handleZoom(-0.1, window.innerWidth / 2, window.innerHeight / 2)
          }
        >
          <ZoomOut size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
