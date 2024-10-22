import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface DraggableProps {
  initialPosition: Position;
  zoomLevel: number;
  panPosition: Position;
}

const useDraggable = ({
  initialPosition,
  zoomLevel,
  panPosition,
}: DraggableProps) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX =
        e.clientX / zoomLevel - dragOffset.x - panPosition.x / zoomLevel;
      const newY =
        e.clientY / zoomLevel - dragOffset.y - panPosition.y / zoomLevel;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, zoomLevel, panPosition]);

  return { position, isDragging, handleMouseDown };
};

export default useDraggable;
