import React, { useState, ReactNode, CSSProperties } from "react";

interface DragMoveProps {
  onPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDragMove?: (event: React.PointerEvent<HTMLDivElement>) => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function DragMove({
  onPointerDown,
  onPointerUp,
  onPointerMove,
  onDragMove,
  children,
  style,
  className
}: DragMoveProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);

    if (onPointerDown) {
      onPointerDown(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (onPointerUp) {
      onPointerUp(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && onDragMove) {
      onDragMove(e);
    }

    if (onPointerMove) {
      onPointerMove(e);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
