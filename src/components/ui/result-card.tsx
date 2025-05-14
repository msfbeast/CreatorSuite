
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";

interface ResultCardProps {
  title: string;
  result: React.ReactNode;
  copyString?: string;
  className?: string;
}

export function ResultCard({ title, result, copyString, className }: ResultCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof result === 'string' ? result : (copyString || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 animate-fade-in",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          size="sm" 
          onClick={handleCopy}
          variant={copied ? "outline" : "default"}
          className={copied ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" : ""}
        >
          {copied ? "Copied!" : "Copy All"}
        </Button>
      </div>
      <div className="bg-white/80 rounded-md p-4 border border-creator-soft-purple/30">
        {copyString && (
          <div className="flex flex-wrap gap-2 mb-2">
            {copyString.split(",").map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-creator-purple/10 text-creator-purple border border-creator-purple/30 rounded-full px-3 py-1 text-sm font-medium"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        <Button
          size="sm"
          onClick={handleCopy}
          variant={copied ? "outline" : "default"}
          className={copied ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" : ""}
        >
          {copied ? "Copied!" : "Copy All"}
        </Button>
      </div>
    </div>
  );
}
