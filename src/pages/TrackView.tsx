import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Layers, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TrackView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7);
  const [selectedCamera, setSelectedCamera] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for professional look
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Only set dimensions if they haven't been set to avoid flicker
    if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    
    // Logic to get X,Y coordinates at a specific percentage (t) of the track
    // t goes from 0 to 1
    const getTrackPoint = (t: number) => {
        const totalLength = 2100; // Approximate total length of segments
        const d = t * totalLength;

        // Segment 1: Bottom Left Straight (Start) -> length 250
        if (d < 250) {
            return { x: 150 + d, y: 450 };
        }
        
        // Segment 2: Left Loop (Turn 1) -> length ~471
        const d2 = d - 250;
        if (d2 < 471) {
            const angle = (Math.PI / 2) - (d2 / 471) * Math.PI; // PI/2 to -PI/2
            return { 
                x: 400 + Math.cos(angle) * 150, 
                y: 300 - Math.sin(angle) * 150 // Canvas Y is inverted
            };
        }

        // Segment 3: Top Straight -> length 300
        const d3 = d2 - 471;
        if (d3 < 300) {
            return { x: 400 + d3, y: 150 };
        }

        // Segment 4: Right Loop (Turn 2/3) -> length ~471
        const d4 = d3 - 300;
        if (d4 < 471) {
            const angle = (-Math.PI / 2) + (d4 / 471) * Math.PI; // -PI/2 to PI/2
            return {
                x: 700 + Math.cos(angle) * 150,
                y: 300 + Math.sin(angle) * 150 
            };
        }

        // Segment 5: Bottom Return Straight -> length ~550
        const d5 = d4 - 471;
        return { x: 700 - d5, y: 450 };
    };

    // Color interpolation helper
    const lerpColor = (color1: number[], color2: number[], factor: number) => {
        const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
        const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
        const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
        return `rgb(${r},${g},${b})`;
    };

    // Colors: Red (High), Green (Med), Blue (Low)
    const colors = {
        high: [239, 68, 68],   // Red-500
        med: [34, 197, 94],    // Green-500
        low: [59, 130, 246]    // Blue-500
    };

    // Define grip zones (0 to 1 along track)
    // This defines the "Center" of the color, the code interpolates between them
    const colorStops = [
        { t: 0.00, color: colors.high }, // Start Line (High Grip)
        { t: 0.20, color: colors.med },  // Entering T1 (Braking -> Med)
        { t: 0.35, color: colors.med },  // Mid Corner (Med)
        { t: 0.50, color: colors.low },  // Back Straight (Cold tires -> Low)
        { t: 0.75, color: colors.high }, // Complex (Rubbered in -> High)
        { t: 1.00, color: colors.high }, // Finish (High)
    ];

    const getGripColor = (t: number) => {
        // Find which two stops we are between
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (t >= colorStops[i].t && t <= colorStops[i+1].t) {
                const range = colorStops[i+1].t - colorStops[i].t;
                const localT = (t - colorStops[i].t) / range;
                return lerpColor(colorStops[i].color, colorStops[i+1].color, localT);
            }
        }
        return lerpColor(colors.high, colors.high, 0); // Fallback
    };

    const drawTrack = () => {
      // Clear canvas
      // Note: We use logic coordinate space 1000x600
      ctx.clearRect(0, 0, 1000, 600);

      // 1. Draw Dark Asphalt Base (The road itself)
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 70; // Base is wider than data line
      ctx.strokeStyle = '#1a1a1a'; // Dark Asphalt
      ctx.shadowBlur = 0;
      
      // Construct base path
      ctx.beginPath();
      ctx.moveTo(150, 450);
      ctx.lineTo(400, 450);
      ctx.arc(400, 300, 150, Math.PI/2, -Math.PI/2, true);
      ctx.lineTo(700, 150);
      ctx.arc(700, 300, 150, -Math.PI/2, Math.PI/2, false);
      ctx.lineTo(150, 450);
      ctx.stroke();

      // 2. Draw Gradient Grip Data Overlay
      // We draw this by stepping along the path and changing color
      ctx.lineWidth = 45;
      const steps = 400; // Resolution of gradient
      
      for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const nextT = (i + 1) / steps;
          
          const p1 = getTrackPoint(t);
          const p2 = getTrackPoint(nextT);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          const col = getGripColor(t);
          ctx.strokeStyle = col;
          
          // Add glow effect to the data line
          ctx.shadowColor = col;
          ctx.shadowBlur = 15;
          
          ctx.stroke();
      }

      // 3. Draw "Live" Car Indicator
      const time = Date.now() * 0.0002; // Speed factor
      const loopT = time % 1;
      const carPos = getTrackPoint(loopT);
      
      // Car Dot
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(carPos.x, carPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // "LIVE" Label
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LIVE", carPos.x, carPos.y - 18);
    };

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      drawTrack();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Session</h2>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Track View</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-card/50 backdrop-blur-sm border-white/10 hover:bg-white/5">
            <Layers className="w-4 h-4" />
            Layers
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-card/50 backdrop-blur-sm border-white/10 hover:bg-white/5">
            <MapPin className="w-4 h-4" />
            Zoom to Sector
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Track Canvas Card */}
        <Card className="lg:col-span-3 p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
          
          {/* Header inside Card */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Grip Heatmap</h2>
                <p className="text-xs text-muted-foreground">Real-time surface friction coefficient</p>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                    <span className="text-foreground">High Grip (1.2μ)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_lime]" />
                    <span className="text-foreground">Medium (0.9μ)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue]" />
                    <span className="text-foreground">Low (0.6μ)</span>
                 </div>
            </div>
          </div>
          
          {/* Canvas Container */}
          <div className="relative w-full h-[500px] bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                 }} 
            />
            <canvas 
              ref={canvasRef}
              className="w-full h-full relative z-10"
              style={{ maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
        </Card>

        {/* Camera Feed Sidebar */}
        <div className="space-y-6">
            {/* Active Camera Feed */}
            <Card className="p-4 bg-card/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Camera className="w-4 h-4" />
                        <span>CAM {selectedCamera} FEED</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="aspect-video bg-black/60 rounded-lg border border-white/5 relative flex items-center justify-center group">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
                     <p className="relative z-10 text-xs text-white/70 font-mono">SIGNAL: STRONG (-42dBm)</p>
                     
                     {/* Camera Overlay UI */}
                     <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 text-[10px] font-mono text-white rounded border border-white/10">REC</div>
                     <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/80">4K • 60FPS</div>
                </div>
            </Card>

            {/* Camera List */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/10 flex flex-col max-h-[400px]">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-semibold text-sm">Available Feeds</h3>
                </div>
                <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((cam) => (
                    <button
                        key={cam}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 ${
                        selectedCamera === cam 
                            ? "bg-primary/10 border border-primary/20 text-primary" 
                            : "hover:bg-white/5 border border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setSelectedCamera(cam)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs opacity-50">0{cam}</span>
                            <span>Turn {cam} Apex</span>
                        </div>
                        {selectedCamera === cam && <Zap className="w-3 h-3" />}
                    </button>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackView;