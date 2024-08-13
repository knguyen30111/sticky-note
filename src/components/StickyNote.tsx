import React, { useState, useRef, useEffect } from "react";
import { X, GripVertical, Maximize2, Minimize2 } from "lucide-react";
import useDraggable from "../hooks/useDraggable";
import useResizable from "../hooks/useResizable";

interface StickyNoteProps {
  initialContent: string;
  onDelete: () => void;
  color: string;
  zIndex: number;
  onFocus: () => void;
}

const StickyNote: React.FC<StickyNoteProps> = ({
  initialContent,
  onDelete,
  color,
  zIndex,
  onFocus,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { position, isDragging, handleMouseDown } = useDraggable({
    x: 100,
    y: 100,
  });
  const { size, isResizing, handleResizeStart, handleMouseMove } = useResizable(
    { width: 250, height: 200 }
  );
  const noteRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e, position);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
      };
    }
  }, [isResizing, position, handleMouseMove]);

  return (
    <div
      ref={noteRef}
      className={`absolute rounded-md shadow-md flex ${
        isCollapsed ? "items-center" : "flex-col"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isCollapsed ? "200px" : `${size.width}px`,
        height: isCollapsed ? "30px" : `${size.height}px`,
        backgroundColor: color,
        transition: isDragging || isResizing ? "none" : "all 0.1s ease-out",
        zIndex: zIndex,
        padding: isCollapsed ? "0 8px" : "8px",
      }}
      onMouseDown={(e) => {
        handleMouseDown(e);
        onFocus();
      }}
    >
      {isCollapsed ? (
        <>
          <button
            className="mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleCollapse}
          >
            <Maximize2 size={14} />
          </button>
          <div className="flex-grow truncate text-sm">
            {content || "Empty note"}
          </div>
          <button
            className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={toggleCollapse}
            >
              <Minimize2 size={16} />
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            className="flex-grow w-full bg-transparent resize-none focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your note here..."
            style={{
              height: `${size.height - 40}px`,
            }}
            onFocus={onFocus}
          />
          <div
            className="absolute bottom-1 right-1 cursor-se-resize"
            onMouseDown={(e) => {
              handleResizeStart(e);
              onFocus();
            }}
          >
            <GripVertical size={16} />
          </div>
        </>
      )}
    </div>
  );
};

export default StickyNote;