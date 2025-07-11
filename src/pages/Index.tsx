import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { PromptInput } from '@/components/PromptInput';
import { ImageComparison } from '@/components/ImageComparison';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-bg.jpg';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
    }
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) {
      toast.error('Please select an image and enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll use the original image as the result
      // In a real app, this would be the AI-generated image
      setGeneratedImage(originalImageUrl!);
      toast.success('Image transformation completed!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-24">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-glass backdrop-blur-sm rounded-full px-4 py-2 border border-border/30">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Image Transformation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Transform Your Images
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">With AI Magic</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload any image and describe how you want it transformed. Our advanced AI will create stunning variations with complete creative freedom.
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">NSFW Freedom</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary-glow" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main App */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Prompt */}
          <div className="space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/30 shadow-card">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">1</span>
                </div>
                Upload Your Image
              </h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/30 shadow-card">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">2</span>
                </div>
                Describe Your Vision
              </h2>
              <PromptInput
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                disabled={!selectedImage}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {generatedImage && originalImageUrl ? (
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/30 shadow-card animate-scale-in">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">3</span>
                  </div>
                  Your Transformation
                </h2>
                <ImageComparison
                  originalImage={originalImageUrl}
                  generatedImage={generatedImage}
                  onDownload={handleDownload}
                />
              </div>
            ) : (
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-12 border border-dashed border-border/30 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-muted-foreground">
                      Ready to Transform
                    </h3>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                      Upload an image and enter a prompt to see the magic happen
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border/30 bg-card/20 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-muted-foreground">
              Experience the future of image transformation with cutting-edge artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get stunning results in seconds with our optimized AI pipeline"
              },
              {
                icon: Heart,
                title: "Complete Freedom",
                description: "No content restrictions - transform any image according to your vision"
              },
              {
                icon: Star,
                title: "Premium Quality",
                description: "High-resolution outputs with incredible detail and artistic fidelity"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
