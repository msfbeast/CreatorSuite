
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolContainer } from '@/components/ui/tool-container';
import { ResultCard } from '@/components/ui/result-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MetadataGenerator = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoContent, setVideoContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  const generateMetadata = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setLoading(true);
    setMetadata(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'metadata generator',
          input: videoTitle + (videoContent ? (' ' + videoContent) : '')
        })
      });
      const data = await response.json();
      console.log('MetadataGenerator API response:', data);
      if (data.titles && data.description) {
        setMetadata(data);
      } else if (data.error) {
        setMetadata('Error: ' + data.error);
      } else {
        setMetadata('Unexpected response from server.');
      }
    } catch (e) {
      setMetadata('Network error.');
    }
    setLoading(false);
  };

  return (
    <PageContainer activeTool="metadata">
      <ToolContainer
        title="Metadata Generator"
        description="Create optimized titles, descriptions, and metadata for your videos to improve SEO and viewer engagement."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title</Label>
            <Input
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. How to Edit Photos Like a Pro"
              className="max-w-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoContent">Video Content Summary (optional)</Label>
            <Textarea
              id="videoContent"
              value={videoContent}
              onChange={(e) => setVideoContent(e.target.value)}
              placeholder="Describe what your video is about"
              className="max-w-lg"
              rows={4}
            />
          </div>

          <Button 
            onClick={generateMetadata} 
            disabled={!videoTitle || loading}
            className="bg-creator-purple hover:bg-creator-purple-dark"
          >
            {loading ? 'Generating...' : 'Generate Metadata'}
          </Button>
        </div>

        {metadata && typeof metadata === 'object' && (
          <div className="mt-8 space-y-8">
            {/* Titles as tiles */}
            <div>
              <h4 className="text-lg font-semibold mb-2 text-creator-purple">Suggested Titles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {metadata.titles && metadata.titles.map((t: string, i: number) => (
                  <div key={i} className="bg-white rounded-xl shadow p-4 border border-creator-soft-purple/30 animate-fade-in">
                    <span className="text-gray-800">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Description as card */}
            <div>
              <h4 className="text-lg font-semibold mb-2 text-creator-purple">Description</h4>
              <div className="bg-white rounded-xl shadow p-4 border border-creator-soft-purple/30 animate-fade-in">
                <span className="text-gray-800 whitespace-pre-line">{metadata.description}</span>
              </div>
            </div>

          </div>
        )}
        {metadata && typeof metadata === 'string' && (
          <div className="mt-8 text-red-600 font-semibold">{metadata}</div>
        )}
      </ToolContainer>
    </PageContainer>
  );
};

export default MetadataGenerator;
