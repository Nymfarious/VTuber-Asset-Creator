import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface AppSettings {
  defaultFrameDuration: number;
  defaultExportFormat: "png" | "gif" | "webp";
  defaultCanvasWidth: number;
  defaultCanvasHeight: number;
  enableBlurTweening: boolean;
  tweenEasing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  theme: "light" | "dark" | "system";
  soundEffects: boolean;
}

const defaultSettings: AppSettings = {
  defaultFrameDuration: 100,
  defaultExportFormat: "png",
  defaultCanvasWidth: 1920,
  defaultCanvasHeight: 1080,
  enableBlurTweening: true,
  tweenEasing: "ease-in-out",
  theme: "system",
  soundEffects: false,
};

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsModal = ({ open, onOpenChange, settings, onSettingsChange }: SettingsModalProps) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    toast.success("Settings saved! 🐰");
    onOpenChange(false);
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success("Cache cleared!");
  };

  const handleExportAll = () => {
    toast.info("Export feature coming soon!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timing & Duration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Animation Defaults</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frameDuration">Frame Duration (ms)</Label>
                  <Input
                    id="frameDuration"
                    type="number"
                    value={localSettings.defaultFrameDuration}
                    onChange={(e) => setLocalSettings({ ...localSettings, defaultFrameDuration: parseInt(e.target.value) || 100 })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select
                    value={localSettings.defaultExportFormat}
                    onValueChange={(value: "png" | "gif" | "webp") => setLocalSettings({ ...localSettings, defaultExportFormat: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="canvasWidth">Canvas Width</Label>
                  <Input
                    id="canvasWidth"
                    type="number"
                    value={localSettings.defaultCanvasWidth}
                    onChange={(e) => setLocalSettings({ ...localSettings, defaultCanvasWidth: parseInt(e.target.value) || 1920 })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="canvasHeight">Canvas Height</Label>
                  <Input
                    id="canvasHeight"
                    type="number"
                    value={localSettings.defaultCanvasHeight}
                    onChange={(e) => setLocalSettings({ ...localSettings, defaultCanvasHeight: parseInt(e.target.value) || 1080 })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tweening */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Tweening & Effects</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="blurTweening">Enable Blur Tweening</Label>
              <Switch
                id="blurTweening"
                checked={localSettings.enableBlurTweening}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enableBlurTweening: checked })}
              />
            </div>
            <div>
              <Label htmlFor="easing">Easing Function</Label>
              <Select
                value={localSettings.tweenEasing}
                onValueChange={(value: AppSettings["tweenEasing"]) => setLocalSettings({ ...localSettings, tweenEasing: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="ease-in">Ease In</SelectItem>
                  <SelectItem value="ease-out">Ease Out</SelectItem>
                  <SelectItem value="ease-in-out">Ease In/Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Appearance</h3>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={localSettings.theme}
                onValueChange={(value: AppSettings["theme"]) => setLocalSettings({ ...localSettings, theme: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sounds">Sound Effects</Label>
              <Switch
                id="sounds"
                checked={localSettings.soundEffects}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, soundEffects: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Storage */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Storage</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearCache}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                Export All Data
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("vtuber-asset-creator-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem("vtuber-asset-creator-settings", JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
};
