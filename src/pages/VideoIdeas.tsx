
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolContainer } from '@/components/ui/tool-container';
import { ResultCard } from '@/components/ui/result-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VideoIdeas = () => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any>(null);

  const generateIdeas = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setLoading(true);
    setIdeas(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'video idea generator',
          input: niche
        })
      });
      const data = await response.json();
      console.log('VideoIdeas API response:', data);
      if (typeof data.content === 'string') {
        setIdeas(data.content);
      } else if (data.error) {
        setIdeas('Error: ' + data.error);
      } else {
        setIdeas('Unexpected response from server.');
      }
    } catch (e) {
      setIdeas('Network error.');
    }
    setLoading(false);
  };

  return (
    <PageContainer activeTool="videos">
      <ToolContainer
        title="Video Idea Generator"
        description="Get inspired with fresh video ideas tailored to your niche and content type."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="niche">Your Content Niche</Label>
            <Input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Fitness, Photography, Gaming"
              className="max-w-lg"
            />
          </div>
          


          <Button 
            onClick={generateIdeas} 
            disabled={!niche || loading}
            className="bg-creator-purple hover:bg-creator-purple-dark"
          >
            {loading ? 'Generating...' : 'Generate Video Ideas'}
          </Button>
        </div>

        {ideas && typeof ideas === 'string' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                const doubleSplit = ideas.split(/\n\s*\n+/g).map(line => line.trim()).filter(Boolean);
                const singleSplit = ideas.split(/\n/g).map(line => line.trim()).filter(Boolean);
                const items = doubleSplit.length > 1 ? doubleSplit : singleSplit;
                return items.map((idea, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4 border border-creator-soft-purple/30 animate-fade-in">
                    <span className="block text-base text-creator-purple font-semibold mb-2">Idea {idx + 1}</span>
                    <span className="text-gray-800">{idea}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
        {ideas && typeof ideas !== 'string' && (
          <div className="mt-8 text-red-600 font-semibold">{ideas}</div>
        )}
      </ToolContainer>
    </PageContainer>
  );
};

export default VideoIdeas;
