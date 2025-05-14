
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolCard } from '@/components/ui/tool-card';
import { Tag, Video, FileText, Link } from 'lucide-react';

const Index = () => {
  const tools = [
    {
      id: 'tags',
      title: 'Tag Generator',
      description: 'Generate relevant tags for your content to improve searchability',
      icon: <Tag className="w-6 h-6 text-creator-purple" />,
      link: '/tags'
    },
    {
      id: 'videos',
      title: 'Video Idea Generator',
      description: 'Get inspired with fresh video ideas tailored to your niche',
      icon: <Video className="w-6 h-6 text-creator-purple" />,
      link: '/videos'
    },
    {
      id: 'metadata',
      title: 'Metadata Generator',
      description: 'Create optimized titles, descriptions, and metadata for your content',
      icon: <FileText className="w-6 h-6 text-creator-purple" />,
      link: '/metadata'
    },
    {

      title: 'Link Shortener',
      description: 'Paste a long URL and get a short link instantly.',
      icon: <Link className="w-6 h-6 text-creator-purple" />,
      link: '/shorten'
    }
  ];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-creator-purple-dark via-creator-purple to-creator-sky-blue bg-clip-text text-transparent">
            Creator Tool Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize your content, all in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              link={tool.link}
              className={`animate-fade-in [animation-delay:${index * 100}ms]`}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
