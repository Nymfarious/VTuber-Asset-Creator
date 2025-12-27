export type AssetCategory = "characters" | "parts" | "sequences" | "props" | "custom";

export interface AssetTag {
  id: string;
  name: string;
  color: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  thumbnailUrl: string;
  fileUrl: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
  frameCount?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface Sequence {
  id: string;
  name: string;
  frames: SequenceFrame[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  favorite: boolean;
}

export interface SequenceFrame {
  id: string;
  assetId: string;
  duration: number;
  order: number;
  blur?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface AIGenerationRequest {
  prompt: string;
  style: "anime" | "chibi" | "realistic" | "pixel";
  width: number;
  height: number;
}

export interface AIGenerationResult {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
}
