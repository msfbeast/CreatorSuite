import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolContainer } from '@/components/ui/tool-container';
import { ResultCard } from '@/components/ui/result-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Shorten = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{original: string, short: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shortenLink = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'link shortener', input: url })
      });
      const data = await response.json();
      if (data.short) {
        setResult({ original: data.original, short: data.short });
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unexpected error.');
      }
    } catch (e) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <PageContainer activeTool="link-shortener">
      <ToolContainer
        title="Link Shortener"
        description="Paste any URL below to generate a short link instantly."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-long-link.com"
              className="max-w-lg"
            />
          </div>
          <Button
            onClick={shortenLink}
            disabled={!url || loading}
            className="bg-creator-purple hover:bg-creator-purple-dark"
          >
            {loading ? 'Shortening...' : 'Shorten Link'}
          </Button>
        </div>
        {error && (
          <div className="mt-8 text-red-600 font-semibold">{error}</div>
        )}
        {result && (
          <div className="mt-8">
            <ResultCard
              title="Shortened Link"
              result={
                <>
                  <div>
                    <strong>Original:</strong> <a href={result.original} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{result.original}</a>
                  </div>
                  <div className="mt-2">
                    <strong>Short:</strong> <a href={result.short} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{result.short}</a>
                  </div>
                </>
              }
              copyString={result.short}
            />
          </div>
        )}
      </ToolContainer>
    </PageContainer>
  );
};

export default Shorten;
