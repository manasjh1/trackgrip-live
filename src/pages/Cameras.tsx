import { Card } from "@/components/ui/card";
import { Camera, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Cameras = () => {
  const [playingCameras, setPlayingCameras] = useState<number[]>([1, 2, 3, 4]);

  const toggleCamera = (camId: number) => {
    setPlayingCameras(prev => 
      prev.includes(camId) 
        ? prev.filter(id => id !== camId)
        : [...prev, camId]
    );
  };

  const cameras = [
    { id: 1, name: "Turn 1 Entry", location: "T1", status: "active" },
    { id: 2, name: "Turn 1 Apex", location: "T1", status: "active" },
    { id: 3, name: "Turn 2-3 Complex", location: "T2-3", status: "active" },
    { id: 4, name: "Main Straight", location: "S1", status: "active" },
    { id: 5, name: "Turn 4 Entry", location: "T4", status: "active" },
    { id: 6, name: "Turn 5 Exit", location: "T5", status: "active" },
    { id: 7, name: "Pit Entry", location: "PIT", status: "active" },
    { id: 8, name: "Start/Finish", location: "S/F", status: "active" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Camera Feeds</h1>
          <p className="text-muted-foreground">Multi-camera view with AI segmentation overlay</p>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameras.map((camera) => (
            <Card key={camera.id} className="p-4 bg-card border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Cam {camera.id}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleCamera(camera.id)}
                >
                  {playingCameras.includes(camera.id) ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Camera Feed Placeholder */}
              <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                {playingCameras.includes(camera.id) ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-background to-muted animate-pulse" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                
                {/* Simulated segmentation overlay */}
                {playingCameras.includes(camera.id) && (
                  <>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-success/80 text-xs font-medium text-white">
                      TRACKING
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-warning animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </>
                )}
              </div>

              {/* Camera Info */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{camera.name}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Location: {camera.location}</span>
                  <span className={`${camera.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}>
                    {camera.status === 'active' ? '● Active' : '○ Offline'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Camera Details */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">System Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Processing FPS</p>
              <p className="text-2xl font-bold text-foreground">58.3</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Model Inference</p>
              <p className="text-2xl font-bold text-foreground">16ms</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">GPU Utilization</p>
              <p className="text-2xl font-bold text-foreground">73%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Latency</p>
              <p className="text-2xl font-bold text-foreground">1.1s</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cameras;
