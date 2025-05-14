
import * as React from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  className?: string
}

export function ToolCard({ 
  title, 
  description, 
  icon, 
  link,
  className
}: ToolCardProps) {
  return (
    <Link
      to={link}
      className={cn(
        "glass-card hover-lift rounded-2xl p-6 flex flex-col items-center text-center transition-all",
        className
      )}
    >
      <div className="h-16 w-16 flex items-center justify-center rounded-full bg-creator-purple/20 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}
