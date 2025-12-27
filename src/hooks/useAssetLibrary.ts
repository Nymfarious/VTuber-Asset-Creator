import { useState, useCallback } from "react";
import { Asset, AssetCategory, AssetTag } from "@/types/assets";
import { toast } from "sonner";

// Demo assets for initial state
const createDemoAssets = (): Asset[] => [
  {
    id: "demo-1",
    name: "Happy Bunny Character",
    category: "characters",
    thumbnailUrl: "/placeholder.svg",
    fileUrl: "/placeholder.svg",
    tags: ["bunny", "cute", "main"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorite: true,
  },
  {
    id: "demo-2",
    name: "Bunny Ears",
    category: "parts",
    thumbnailUrl: "/placeholder.svg",
    fileUrl: "/placeholder.svg",
    tags: ["ears", "accessory"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorite: false,
  },
  {
    id: "demo-3",
    name: "Wave Animation",
    category: "sequences",
    thumbnailUrl: "/placeholder.svg",
    fileUrl: "/placeholder.svg",
    tags: ["animation", "greeting"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorite: false,
    frameCount: 12,
    duration: 1200,
  },
];

const defaultTags: AssetTag[] = [
  { id: "1", name: "cute", color: "hsl(340 70% 80%)" },
  { id: "2", name: "main", color: "hsl(270 60% 70%)" },
  { id: "3", name: "accessory", color: "hsl(160 50% 75%)" },
  { id: "4", name: "animation", color: "hsl(20 80% 80%)" },
];

export const useAssetLibrary = () => {
  const [assets, setAssets] = useState<Asset[]>(createDemoAssets);
  const [tags, setTags] = useState<AssetTag[]>(defaultTags);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAssets = assets.filter((asset) => {
    // Category filter
    if (selectedCategory !== "all" && asset.category !== selectedCategory) {
      return false;
    }
    // Tag filter
    if (selectedTags.length > 0 && !selectedTags.some((tag) => asset.tags.includes(tag))) {
      return false;
    }
    // Search filter
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const addAsset = useCallback((asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => {
    const newAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAssets((prev) => [...prev, newAsset]);
    toast.success(`Added "${asset.name}" to library! 🐰`);
    return newAsset;
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, ...updates, updatedAt: new Date() } : asset
      )
    );
    toast.success("Asset updated!");
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    toast.success("Asset deleted!");
  }, []);

  const duplicateAsset = useCallback((id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    
    const duplicate: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      name: `${asset.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAssets((prev) => [...prev, duplicate]);
    toast.success("Asset duplicated! 🐰");
  }, [assets]);

  const toggleFavorite = useCallback((id: string) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, favorite: !asset.favorite, updatedAt: new Date() } : asset
      )
    );
  }, []);

  const addTag = useCallback((name: string, color: string) => {
    const newTag: AssetTag = {
      id: `tag-${Date.now()}`,
      name,
      color,
    };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  }, []);

  const moveToCategory = useCallback((id: string, category: AssetCategory) => {
    updateAsset(id, { category });
  }, [updateAsset]);

  return {
    assets: filteredAssets,
    allAssets: assets,
    tags,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    addAsset,
    updateAsset,
    deleteAsset,
    duplicateAsset,
    toggleFavorite,
    addTag,
    moveToCategory,
  };
};
