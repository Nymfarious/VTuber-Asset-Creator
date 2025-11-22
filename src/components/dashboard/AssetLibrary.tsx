import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Edit, Trash2 } from "lucide-react";

// Mock data for demonstration
const mockAssets = [
  {
    id: "1",
    name: "Purple Cat Girl VTuber Pack",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop",
    status: "complete",
    layers: 12,
    expressions: 31,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Blue Fox Character Set",
    thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop",
    status: "processing",
    layers: 8,
    expressions: 18,
    createdAt: "2024-01-20",
  },
];

export const AssetLibrary = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Assets</h3>
          <p className="text-sm text-muted-foreground">
            {mockAssets.length} asset pack{mockAssets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAssets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden shadow-card hover:shadow-elevated transition-all">
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={asset.status === "complete" ? "default" : "secondary"}
                  className="bg-card/90 backdrop-blur-sm"
                >
                  {asset.status}
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold mb-1">{asset.name}</h4>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span>{asset.layers} layers</span>
                  <span>•</span>
                  <span>{asset.expressions} expressions</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockAssets.length === 0 && (
        <Card className="p-12 text-center shadow-card">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
              <Download className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No assets yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first character image to get started with the AI pipeline
            </p>
            <Button>Upload Character Image</Button>
          </div>
        </Card>
      )}
    </div>
  );
};
