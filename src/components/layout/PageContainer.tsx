
import React from 'react';
import { Navbar } from './Navbar';

interface PageContainerProps {
  children: React.ReactNode;
  activeTool?: string;
  className?: string;
}

export const PageContainer = ({ 
  children, 
  activeTool, 
  className = "" 
}: PageContainerProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-creator-soft-purple/30 via-white to-creator-soft-blue/20">
      <Navbar activeTool={activeTool} />
      <main className={`container mx-auto pt-24 pb-12 px-4 ${className}`}>
        {children}
      </main>
    </div>
  );
};
