import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Settings,
  Download,
  GripVertical,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { BunnyMascot } from "@/components/BunnyMascot";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Frame {
  id: string;
  imageUrl: string;
  duration: number;
  blur?: number;
}

export const SequencingWorkspace = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [timelineHeight, setTimelineHeight] = useState(25); // Percentage
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<number | null>(null);

  // Playback logic
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      const currentDuration = frames[currentFrame]?.duration || 100;
      playIntervalRef.current = window.setTimeout(() => {
        if (currentFrame < frames.length - 1) {
          setCurrentFrame((prev) => prev + 1);
        } else if (isLooping) {
          setCurrentFrame(0);
        } else {
          setIsPlaying(false);
        }
      }, currentDuration);
    }

    return () => {
      if (playIntervalRef.current) {
        clearTimeout(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentFrame, frames, isLooping]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };
  const handlePrevFrame = () => setCurrentFrame((prev) => Math.max(0, prev - 1));
  const handleNextFrame = () => setCurrentFrame((prev) => Math.min(frames.length - 1, prev + 1));

  const handleAddFrame = () => {
    const newFrame: Frame = {
      id: `frame-${Date.now()}`,
      imageUrl: "/placeholder.svg",
      duration: 100,
      blur: 0,
    };
    setFrames((prev) => [...prev, newFrame]);
    toast.success("Frame added! 🐰");
  };

  const handleRemoveFrame = (index: number) => {
    setFrames((prev) => prev.filter((_, i) => i !== index));
    if (currentFrame >= frames.length - 1) {
      setCurrentFrame(Math.max(0, frames.length - 2));
    }
    toast.success("Frame removed!");
  };

  const handleFrameDurationChange = (index: number, duration: number) => {
    setFrames((prev) =>
      prev.map((frame, i) => (i === index ? { ...frame, duration } : frame))
    );
  };

  const handleTimelineResize = useCallback((e: MouseEvent) => {
    if (!isDraggingTimeline) return;
    const windowHeight = window.innerHeight;
    const percentage = ((windowHeight - e.clientY) / windowHeight) * 100;
    setTimelineHeight(Math.min(Math.max(10, percentage), 60));
  }, [isDraggingTimeline]);

  useEffect(() => {
    if (isDraggingTimeline) {
      window.addEventListener("mousemove", handleTimelineResize);
      window.addEventListener("mouseup", () => setIsDraggingTimeline(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleTimelineResize);
      window.removeEventListener("mouseup", () => setIsDraggingTimeline(false));
    };
  }, [isDraggingTimeline, handleTimelineResize]);

  const currentFrameData = frames[currentFrame];
  const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0" style={{ height: `${100 - timelineHeight}%` }}>
        <Card className="h-full shadow-card overflow-hidden">
          {frames.length === 0 ? (
            <EmptyState
              title="Create your first sequence!"
              description="Add frames to start building your animation 🎬"
              actionLabel="Add First Frame"
              onAction={handleAddFrame}
              className="h-full"
            />
          ) : (
            <div className="h-full flex flex-col">
              {/* Canvas Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Frame {currentFrame + 1} / {frames.length}
                  </Badge>
                  <Badge variant="outline">
                    {totalDuration}ms total
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="flex-1 flex items-center justify-center bg-muted/50 p-8 overflow-hidden"
              >
                {currentFrameData ? (
                  <div className="relative max-w-full max-h-full aspect-video rounded-2xl overflow-hidden shadow-elevated bg-card">
                    <img
                      src={currentFrameData.imageUrl}
                      alt={`Frame ${currentFrame + 1}`}
                      className="w-full h-full object-contain"
                      style={{
                        filter: currentFrameData.blur ? `blur(${currentFrameData.blur}px)` : undefined,
                      }}
                    />
                  </div>
                ) : (
                  <BunnyMascot size="xl" />
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-t bg-card">
                <Button variant="outline" size="icon" onClick={handleStop}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePrevFrame}>
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </Button>
                {isPlaying ? (
                  <Button size="icon" onClick={handlePause} className="w-12 h-12 rounded-full bg-gradient-primary">
                    <Pause className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button size="icon" onClick={handlePlay} className="w-12 h-12 rounded-full bg-gradient-primary">
                    <Play className="w-5 h-5 ml-0.5" />
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={handleNextFrame}>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleStop}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button
                  variant={isLooping ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsLooping(!isLooping)}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Resize Handle */}
      <div
        className="h-2 cursor-ns-resize flex items-center justify-center hover:bg-muted transition-colors"
        onMouseDown={() => setIsDraggingTimeline(true)}
      >
        <div className="w-12 h-1 rounded-full bg-border" />
      </div>

      {/* Timeline Panel */}
      <div style={{ height: `${timelineHeight}%` }} className="min-h-[100px]">
        <Card className="h-full shadow-card overflow-hidden flex flex-col">
          {/* Timeline Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Timeline</h3>
              <Badge variant="outline" className="text-xs">
                {frames.length} frames
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => setTimelineZoom((z) => Math.max(0.5, z - 0.25))}>
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(timelineZoom * 100)}%</span>
              <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => setTimelineZoom((z) => Math.min(3, z + 0.25))}>
                <ZoomIn className="w-3 h-3" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button size="sm" onClick={handleAddFrame} className="gap-1">
                <Plus className="w-3 h-3" />
                Add Frame
              </Button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
            {frames.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Click "Add Frame" to start building your sequence 🐰
              </div>
            ) : (
              <div className="flex gap-2 h-full items-center" style={{ transform: `scaleX(${timelineZoom})`, transformOrigin: "left" }}>
                {frames.map((frame, index) => (
                  <div
                    key={frame.id}
                    className={cn(
                      "relative group shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all",
                      "w-24 h-full border-2",
                      currentFrame === index
                        ? "border-primary shadow-glow"
                        : "border-transparent hover:border-primary/50"
                    )}
                    onClick={() => setCurrentFrame(index)}
                  >
                    <img
                      src={frame.imageUrl}
                      alt={`Frame ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-card font-medium">{frame.duration}ms</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-5 h-5 text-card hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFrame(index);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-1 left-1">
                      <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-card/90">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Frame Duration Slider (when a frame is selected) */}
          {currentFrameData && (
            <div className="px-4 py-2 border-t bg-card flex items-center gap-4 shrink-0">
              <span className="text-xs text-muted-foreground shrink-0">Frame Duration:</span>
              <Slider
                value={[currentFrameData.duration]}
                min={50}
                max={1000}
                step={50}
                onValueChange={([value]) => handleFrameDurationChange(currentFrame, value)}
                className="flex-1 max-w-xs"
              />
              <span className="text-xs font-medium w-16">{currentFrameData.duration}ms</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
