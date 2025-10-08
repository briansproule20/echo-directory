import { cn } from "@/lib/utils";
import React from "react";

interface DotBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  dotColor?: string;
  dotColorDark?: string;
}

export function DotBackground({
  children,
  className,
  dotColor = "#e0d4f7",
  dotColorDark = "#4a3b6b"
}: DotBackgroundProps) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
        )}
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 hidden dark:block",
          "[background-size:20px_20px]",
        )}
        style={{
          backgroundImage: `radial-gradient(${dotColorDark} 1px, transparent 1px)`,
        }}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

export default DotBackground;
