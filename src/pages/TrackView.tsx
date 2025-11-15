import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TrackView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7);
  const [selectedCamera, setSelectedCamera] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Draw racing track outline (simplified circuit)
    const drawTrack = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Track background
      ctx.fillStyle = 'hsl(220, 15%, 10%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw simplified track shape
      ctx.strokeStyle = 'hsl(220, 15%, 25%)';
      ctx.lineWidth = 80;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      // Main straight
      ctx.moveTo(100, 300);
      ctx.lineTo(300, 300);
      // Turn 1-2
      ctx.arc(300, 200, 100, Math.PI/2, -Math.PI/2, true);
      // Back straight
      ctx.lineTo(600, 100);
      // Turn 3-4
      ctx.arc(600, 200, 100, -Math.PI/2, Math.PI/2, true);
      // Return to start
      ctx.lineTo(300, 300);
      ctx.stroke();

      // Draw grip heatmap overlay
      drawHeatmap(ctx);

      // Draw corner markers
      drawCornerMarkers(ctx);
    };

    const drawHeatmap = (ctx: CanvasRenderingContext2D) => {
      // Simulate grip zones with gradients
      const zones = [
        // High grip zone - Turn 1
        { x: 350, y: 150, radius: 60, color: 'hsl(142, 76%, 45%)' },
        // Medium grip - Turn 2
        { x: 400, y: 150, radius: 50, color: 'hsl(45, 100%, 55%)' },
        // High grip - straight
        { x: 500, y: 100, radius: 70, color: 'hsl(142, 76%, 45%)' },
        // Warning zone - Turn 3
        { x: 600, y: 180, radius: 55, color: 'hsl(25, 95%, 53%)' },
        // Good grip - Turn 4
        { x: 550, y: 280, radius: 60, color: 'hsl(142, 76%, 45%)' },
      ];

      zones.forEach(zone => {
        const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, zone.radius);
        gradient.addColorStop(0, zone.color.replace(')', `, ${heatmapIntensity})`));
        gradient.addColorStop(1, zone.color.replace(')', ', 0)'));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCornerMarkers = (ctx: CanvasRenderingContext2D) => {
      const corners = [
        { x: 300, y: 150, label: 'T1' },
        { x: 400, y: 100, label: 'T2' },
        { x: 600, y: 100, label: 'T3' },
        { x: 600, y: 280, label: 'T4' },
      ];

      ctx.fillStyle = 'hsl(0, 0%, 98%)';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';

      corners.forEach(corner => {
        // Marker dot
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillText(corner.label, corner.x, corner.y - 10);
      });
    };

    drawTrack();

    // Animate heatmap
    const interval = setInterval(() => {
      drawTrack();
    }, 2000);

    return () => clearInterval(interval);
  }, [heatmapIntensity]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Track View</h1>
            <p className="text-muted-foreground">Live grip heatmap overlay</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Layers className="w-4 h-4" />
              Layers
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Zoom to Turn
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Track Canvas */}
          <Card className="lg:col-span-3 p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Circuit Layout</h2>
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">Heatmap Intensity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={heatmapIntensity}
                  onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
                  className="w-32"
                />
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <canvas 
                ref={canvasRef}
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              />
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-grip-high" />
                <span className="text-sm text-muted-foreground">High Grip</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-grip-medium" />
                <span className="text-sm text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-grip-low" />
                <span className="text-sm text-muted-foreground">Low Grip</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-grip-danger" />
                <span className="text-sm text-muted-foreground">Danger</span>
              </div>
            </div>
          </Card>

          {/* Camera Controls */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Camera Feeds</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cam) => (
                <Button
                  key={cam}
                  variant={selectedCamera === cam ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedCamera(cam)}
                >
                  <Camera className="w-4 h-4" />
                  Camera {cam} - {cam <= 2 ? 'Turn 1' : cam <= 4 ? 'Turn 2-3' : 'Turn 4-5'}
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
              <h3 className="text-sm font-medium text-foreground">Camera {selectedCamera}</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Status: <span className="text-success">Active</span></p>
                <p>FPS: 60</p>
                <p>Latency: 1.1s</p>
                <p>Resolution: 1920x1080</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackView;
