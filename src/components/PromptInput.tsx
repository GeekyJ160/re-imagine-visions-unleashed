import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const suggestedPrompts = [
  "Transform into a fantasy painting",
  "Make it look like an oil painting",
  "Convert to anime style",
  "Add dramatic lighting",
  "Make it photorealistic",
  "Turn into a cyberpunk scene"
];

export function PromptInput({ 
  prompt, 
  onPromptChange, 
  onGenerate, 
  isGenerating = false,
  disabled = false 
}: PromptInputProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    onPromptChange(suggestion);
    setSelectedSuggestion(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="prompt" className="text-sm font-medium text-foreground">
          Transformation Prompt
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe how you want to transform your image..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={disabled}
          className="min-h-[100px] bg-card/50 backdrop-blur-sm border-border/30 focus:border-primary/50 transition-all resize-none"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Quick Prompts</Label>
        <div className="grid grid-cols-2 gap-2">
          {suggestedPrompts.map((suggestion) => (
            <Button
              key={suggestion}
              variant={selectedSuggestion === suggestion ? "default" : "glass"}
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
              className="text-xs h-8 justify-start"
            >
              <Wand2 className="w-3 h-3" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={disabled || !prompt.trim() || isGenerating}
        variant="gradient"
        size="lg"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Transform Image
          </>
        )}
      </Button>
    </div>
  );
}