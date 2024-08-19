import { useState, useEffect } from "react";

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

const useResizable = (initialSize: Size, zoomLevel: number) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const handleResizeStart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent, position: Position) => {
    if (isResizing) {
      setSize({
        width: Math.max(200, e.clientX / zoomLevel - position.x),
        height: Math.max(150, e.clientY / zoomLevel - position.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  return { size, isResizing, handleResizeStart, handleMouseMove };
};

export default useResizable;
