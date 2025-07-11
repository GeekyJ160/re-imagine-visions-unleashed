import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  originalImage: string;
  generatedImage: string;
  onDownload: () => void;
  className?: string;
}

export function ImageComparison({ 
  originalImage, 
  generatedImage, 
  onDownload,
  className 
}: ImageComparisonProps) {
  const [showComparison, setShowComparison] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Result</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Comparison
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Comparison
              </>
            )}
          </Button>
          <Button variant="premium" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden bg-card shadow-card">
        {showComparison ? (
          <div
            className="relative cursor-ew-resize select-none"
            onClick={handleSliderChange}
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                handleSliderChange(e);
              }
            }}
          >
            <img
              src={generatedImage}
              alt="Generated result"
              className="w-full h-auto block"
            />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage}
                alt="Original image"
                className="w-full h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%` }}
              />
            </div>
            <div
              className="absolute top-0 h-full w-0.5 bg-primary shadow-glow cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-glow flex items-center justify-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
              Original
            </div>
            <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-primary-foreground">
              Generated
            </div>
          </div>
        ) : (
          <img
            src={generatedImage}
            alt="Generated result"
            className="w-full h-auto"
          />
        )}
      </div>
    </div>
  );
}