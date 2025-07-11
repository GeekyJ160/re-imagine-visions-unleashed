import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
  className?: string;
}

export function ImageUpload({ onImageSelect, selectedImage, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null as any);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-gradient-glass backdrop-blur-sm transition-all duration-300 cursor-pointer",
            "hover:border-primary/50 hover:bg-gradient-glass",
            "min-h-[200px] flex flex-col items-center justify-center p-8",
            isDragActive && "border-primary bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? "Drop your image here" : "Upload an image to transform"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to select • PNG, JPG, WebP
              </p>
            </div>
            <Button variant="glass" size="lg" className="animate-scale-in">
              <ImageIcon className="w-4 h-4" />
              Choose Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="rounded-lg overflow-hidden bg-card shadow-card">
            <img
              src={preview}
              alt="Selected image"
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}