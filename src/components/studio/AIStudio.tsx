import { useState } from "react";
import { Wand2, Sparkles, Download, Save, RefreshCw, History, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { BunnyMascot } from "@/components/BunnyMascot";
import { toast } from "sonner";
import { AIGenerationResult } from "@/types/assets";

const stylePresets = [
  { value: "anime", label: "Anime", emoji: "🎨" },
  { value: "chibi", label: "Chibi", emoji: "🥰" },
  { value: "realistic", label: "Realistic", emoji: "📷" },
  { value: "pixel", label: "Pixel Art", emoji: "👾" },
];

const sizePresets = [
  { width: 512, height: 512, label: "Square (512×512)" },
  { width: 768, height: 512, label: "Landscape (768×512)" },
  { width: 512, height: 768, label: "Portrait (512×768)" },
  { width: 1024, height: 1024, label: "Large (1024×1024)" },
];

export const AIStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>("anime");
  const [sizeIndex, setSizeIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<AIGenerationResult | null>(null);
  const [history, setHistory] = useState<AIGenerationResult[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt! 🐰");
      return;
    }

    setIsGenerating(true);
    toast.loading("Creating your masterpiece... 🎨");

    // Simulate AI generation (demo mode)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result: AIGenerationResult = {
      id: `gen-${Date.now()}`,
      prompt,
      style,
      imageUrl: "/placeholder.svg", // In real implementation, this would be the generated image
      createdAt: new Date(),
    };

    setCurrentResult(result);
    setHistory((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10
    setIsGenerating(false);
    toast.dismiss();
    toast.success("Image generated! 🐰✨");
  };

  const handleSaveToLibrary = () => {
    if (!currentResult) return;
    toast.success("Saved to library! Check your Assets 🐰");
  };

  const handleExport = () => {
    if (!currentResult) return;
    toast.success("Download started! 🐰");
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const selectedSize = sizePresets[sizeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Generation Panel */}
      <Card className="p-6 shadow-card lg:col-span-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold">AI Studio</h3>
            <p className="text-xs text-muted-foreground">Create with AI magic ✨</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Prompt */}
          <div>
            <Label htmlFor="prompt">Describe your character</Label>
            <Textarea
              id="prompt"
              placeholder="A cute bunny girl with long pink hair, wearing a pastel dress..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          {/* Style */}
          <div>
            <Label>Art Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {stylePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={style === preset.value ? "default" : "outline"}
                  className="justify-start gap-2"
                  onClick={() => setStyle(preset.value)}
                >
                  {preset.emoji} {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <Label>Image Size</Label>
            <Select value={sizeIndex.toString()} onValueChange={(v) => setSizeIndex(parseInt(v))}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizePresets.map((preset, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full gap-2 hover-bounce bg-gradient-primary"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Image
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Demo mode: AI generation is simulated 🐰
          </p>
        </div>
      </Card>

      {/* Preview Panel */}
      <Card className="p-6 shadow-card lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Preview</h3>
          {currentResult && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleSaveToLibrary} className="gap-2">
                <Save className="w-4 h-4" />
                Save to Library
              </Button>
            </div>
          )}
        </div>

        {currentResult ? (
          <div className="space-y-4">
            <div className="aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden bg-muted shadow-elevated">
              <img
                src={currentResult.imageUrl}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">"{currentResult.prompt}"</p>
              <Badge variant="secondary" className="mt-2">
                {stylePresets.find((s) => s.value === currentResult.style)?.emoji}{" "}
                {stylePresets.find((s) => s.value === currentResult.style)?.label}
              </Badge>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Ready to create!"
            description="Enter a prompt and click Generate to create your first AI image 🎨"
            icon={
              <div className="relative">
                <BunnyMascot size="xl" />
                <div className="absolute -right-2 -top-2">
                  <Sparkles className="w-8 h-8 text-accent animate-float" />
                </div>
              </div>
            }
          />
        )}
      </Card>

      {/* History Panel */}
      {history.length > 0 && (
        <Card className="p-6 shadow-card lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            <h3 className="font-bold">Recent Generations</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {history.map((item) => (
              <button
                key={item.id}
                className="aspect-square rounded-xl overflow-hidden bg-muted hover:ring-2 ring-primary transition-all hover-bounce"
                onClick={() => setCurrentResult(item)}
              >
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
