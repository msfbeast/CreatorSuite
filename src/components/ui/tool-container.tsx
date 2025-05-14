
import React from "react";
import { cn } from "@/lib/utils";

interface ToolContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolContainer({
  title,
  description,
  children,
  className,
}: ToolContainerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-creator-purple to-creator-sky-blue bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="glass p-6 rounded-xl animate-scale-in">
        {children}
      </div>
    </div>
  );
}
