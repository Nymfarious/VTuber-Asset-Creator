import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Grid3X3,
  List,
  Search,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  FolderInput,
  Star,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { BunnyMascot } from "@/components/BunnyMascot";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { Asset, AssetCategory } from "@/types/assets";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryConfig: Record<AssetCategory, { label: string; icon: string; color: string }> = {
  characters: { label: "Characters", icon: "👤", color: "bg-category-characters" },
  parts: { label: "Parts", icon: "🧩", color: "bg-category-parts" },
  sequences: { label: "Sequences", icon: "🎬", color: "bg-category-sequences" },
  props: { label: "Props", icon: "🎭", color: "bg-category-props" },
  custom: { label: "Custom", icon: "✨", color: "bg-category-custom" },
};

export const AssetLibraryNew = () => {
  const {
    assets,
    tags,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    deleteAsset,
    duplicateAsset,
    toggleFavorite,
    moveToCategory,
    addAsset,
  } = useAssetLibrary();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        addAsset({
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "custom",
          thumbnailUrl: url,
          fileUrl: url,
          tags: [],
          favorite: false,
        });
      }
    });
    toast.success(`Imported ${files.length} file(s)! 🐰`);
  };

  const handleImportFromUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      addAsset({
        name: "Imported Asset",
        category: "custom",
        thumbnailUrl: url,
        fileUrl: url,
        tags: [],
        favorite: false,
      });
      toast.success("Imported from URL! 🐰");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 hover-bounce">
                <Plus className="w-4 h-4" />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportFromUrl}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Import from URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as AssetCategory | "all")}>
        <TabsList className="bg-card shadow-soft">
          <TabsTrigger value="all" className="gap-2">
            📁 All
          </TabsTrigger>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              {config.icon} {config.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center transition-all",
          dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="font-medium">Drop files here to import</p>
          <p className="text-sm text-muted-foreground">or use the Import button above</p>
        </div>
      </div>

      {/* Asset Grid/List */}
      {assets.length === 0 ? (
        <EmptyState
          title="No assets yet!"
          description="Let's add some cute assets to your library! Drop files above or use the Import button."
          actionLabel="Import Assets"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDelete={() => deleteAsset(asset.id)}
              onDuplicate={() => duplicateAsset(asset.id)}
              onToggleFavorite={() => toggleFavorite(asset.id)}
              onMoveToCategory={(category) => moveToCategory(asset.id, category)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => (
            <AssetListItem
              key={asset.id}
              asset={asset}
              onDelete={() => deleteAsset(asset.id)}
              onDuplicate={() => duplicateAsset(asset.id)}
              onToggleFavorite={() => toggleFavorite(asset.id)}
              onMoveToCategory={(category) => moveToCategory(asset.id, category)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AssetItemProps {
  asset: Asset;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onMoveToCategory: (category: AssetCategory) => void;
}

const AssetCard = ({ asset, onDelete, onDuplicate, onToggleFavorite, onMoveToCategory }: AssetItemProps) => {
  const config = categoryConfig[asset.category];
  
  return (
    <Card className="group overflow-hidden hover-bounce shadow-card hover:shadow-elevated">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={asset.thumbnailUrl}
          alt={asset.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart className={cn("w-4 h-4", asset.favorite && "fill-pink text-pink")} />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
            {config.icon} {config.label}
          </Badge>
        </div>

        {/* Frame count for sequences */}
        {asset.frameCount && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
              {asset.frameCount} frames
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm truncate flex-1">{asset.name}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderInput className="w-4 h-4 mr-2" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <DropdownMenuItem key={key} onClick={() => onMoveToCategory(key as AssetCategory)}>
                      {config.icon} {config.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onToggleFavorite}>
                <Star className="w-4 h-4 mr-2" />
                {asset.favorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {asset.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                +{asset.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const AssetListItem = ({ asset, onDelete, onDuplicate, onToggleFavorite, onMoveToCategory }: AssetItemProps) => {
  const config = categoryConfig[asset.category];
  
  return (
    <Card className="flex items-center gap-4 p-3 hover:shadow-soft transition-shadow">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
        <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate">{asset.name}</h4>
          {asset.favorite && <Heart className="w-4 h-4 fill-pink text-pink shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {config.icon} {config.label}
          </Badge>
          {asset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
          <Heart className={cn("w-4 h-4", asset.favorite && "fill-pink text-pink")} />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInput className="w-4 h-4 mr-2" />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <DropdownMenuItem key={key} onClick={() => onMoveToCategory(key as AssetCategory)}>
                    {cfg.icon} {cfg.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
