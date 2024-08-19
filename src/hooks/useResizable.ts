import { useState, useCallback } from "react";

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface ResizableProps {
  initialSize: Size;
  zoomLevel: number;
  panPosition: Position;
  minWidth?: number;
  minHeight?: number;
}

const useResizable = ({
  initialSize,
  zoomLevel,
  panPosition,
  minWidth = 200,
  minHeight = 150,
}: ResizableProps) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeStart, setResizeStart] = useState<Position>({ x: 0, y: 0 });
  const [resizeInitialSize, setResizeInitialSize] = useState<Size>(initialSize);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
      });
      setResizeInitialSize({ ...size });
    },
    [size]
  );

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const dx = (e.clientX - resizeStart.x) / zoomLevel;
      const dy = (e.clientY - resizeStart.y) / zoomLevel;

      setSize({
        width: Math.max(minWidth, resizeInitialSize.width + dx),
        height: Math.max(minHeight, resizeInitialSize.height + dy),
      });
    },
    [isResizing, resizeStart, zoomLevel, resizeInitialSize, minWidth, minHeight]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  return {
    size,
    isResizing,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
  };
};

export default useResizable;
