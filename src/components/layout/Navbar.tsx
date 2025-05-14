
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Navbar = ({ activeTool }: { activeTool?: string }) => {
  const tools = [
    { 
      id: 'tags', 
      name: 'Tag Generator', 
      path: '/tags',
      icon: <Tag className="w-4 h-4 mr-2" /> 
    },
    { 
      id: 'videos', 
      name: 'Video Ideas', 
      path: '/videos',
      icon: <Video className="w-4 h-4 mr-2" /> 
    },
    { 
      id: 'metadata', 
      name: 'Metadata', 
      path: '/metadata',
      icon: <FileText className="w-4 h-4 mr-2" /> 
    },
    { 
      id: 'shorten',
      name: 'Link Shortener',
      path: '/shorten',
      icon: <LinkIcon className="w-4 h-4 mr-2" /> 
    }
  ];

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-10 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold bg-gradient-to-r from-creator-purple to-creator-sky-blue bg-clip-text text-transparent"
        >
          Creator Suite
        </Link>
        
        <div className="hidden md:flex space-x-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              className={cn(
                "rounded-full px-4",
                activeTool === tool.id ? 
                  "bg-creator-purple text-white" : 
                  "hover:bg-creator-soft-purple"
              )}
              asChild
            >
              <Link to={tool.path} className="flex items-center">
                {tool.icon}
                {tool.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
