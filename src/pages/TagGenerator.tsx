
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolContainer } from '@/components/ui/tool-container';
import { ResultCard } from '@/components/ui/result-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TagGenerator = () => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string | null>(null);

  const generateTags = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setLoading(true);
    setTags(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "tag generator",
          input: topic,
          description
        }),
      });
      const data = await response.json();
      // Adjust this depending on your backend's response shape
      setTags(data.tags || data.result || JSON.stringify(data));
    } catch (e) {
      setTags("Error generating tags.");
    }
    setLoading(false);
  };

  return (
    <PageContainer activeTool="tags">
      <ToolContainer
        title="Tag Generator"
        description="Generate relevant, high-performing tags for your content to improve discoverability and reach."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Content Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photography tips"
              className="max-w-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Content Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content to generate more accurate tags"
              className="max-w-lg"
              rows={4}
            />
          </div>

          <Button 
            onClick={generateTags} 
            disabled={!topic || loading}
            className="bg-creator-purple hover:bg-creator-purple-dark"
          >
            {loading ? 'Generating...' : 'Generate Tags'}
          </Button>
        </div>

        {tags && (
          <div className="mt-8">
            <ResultCard 
              title="Generated Tags" 
              result={
                <>
                  <div className="mb-4">
                    <strong>Copy-paste (comma-separated):</strong>
                    <div style={{wordBreak: 'break-all', background: '#f9f9f9', padding: '8px', borderRadius: '4px', marginTop: '4px'}}>{tags}</div>
                  </div>
                  <div>
                    <strong>Individual Tags:</strong>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px'}}>
                      {tags.split(',').map((tag, idx) => {
                        const t = tag.trim();
                        return t ? (
                          <span key={idx} style={{background: '#ececec', borderRadius: '3px', padding: '2px 8px', fontSize: '0.95em'}}>{t}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </>
              }
              copyString={tags}
            />
          </div>
        )}
      </ToolContainer>
    </PageContainer>
  );
};

export default TagGenerator;
