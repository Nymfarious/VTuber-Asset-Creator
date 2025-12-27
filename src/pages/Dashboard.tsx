import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Settings, LogIn, Wand2, Film, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BunnyMascot } from "@/components/BunnyMascot";
import { AssetLibraryNew } from "@/components/library/AssetLibraryNew";
import { AIStudio } from "@/components/studio/AIStudio";
import { SequencingWorkspace } from "@/components/sequencer/SequencingWorkspace";
import { SettingsModal, useSettings } from "@/components/SettingsModal";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("library");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BunnyMascot size="sm" animated={false} />
              <div>
                <h1 className="text-xl font-bold text-gradient">
                  VTuber Asset Creator
                </h1>
                <p className="text-xs text-muted-foreground">Make cute things! 🐰</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card shadow-soft">
            <TabsTrigger value="library" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Asset Library
            </TabsTrigger>
            <TabsTrigger value="studio" className="gap-2">
              <Wand2 className="w-4 h-4" />
              AI Studio
            </TabsTrigger>
            <TabsTrigger value="sequences" className="gap-2">
              <Layers className="w-4 h-4" />
              Sequences
            </TabsTrigger>
            <TabsTrigger value="sequencer" className="gap-2">
              <Film className="w-4 h-4" />
              Sequencer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <AssetLibraryNew />
          </TabsContent>

          <TabsContent value="studio">
            <AIStudio />
          </TabsContent>

          <TabsContent value="sequences">
            <AssetLibraryNew />
          </TabsContent>

          <TabsContent value="sequencer">
            <SequencingWorkspace />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default Dashboard;
