import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Layers, Zap, Upload, X, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Types for Backend API Response - UPDATED to match actual backend
interface AnalysisStatistics {
  total_patches_analyzed: number;
  dangerous_area_percentage: string;  // String like "14.9%"
  max_danger_score: string;          // String like "0.674"
  safety_status: string;             // "SAFE" or "CAUTION"
}

interface AnalysisResponse {
  status: string;
  image_id?: string;
  timestamp: string;
  image_size: [number, number];
  heatmap_base64: string;
  heatmap_file_path?: string;
  heatmap_url?: string;
  statistics: AnalysisStatistics;    // Changed from 'summary' to 'statistics'
  model_info: {
    accuracy: string;
    algorithm: string;
  };
}

const TrackView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7);
  const [selectedCamera, setSelectedCamera] = useState(1);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Handle Image Upload and API Call
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('camera_id', `CAM_${selectedCamera}`);

      // Connect to the backend API
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data: AnalysisResponse = await response.json();
      console.log("Analysis complete. Received Base64 length:", data.heatmap_base64?.length);
      console.log("Full response:", data);  // Debug log
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      // In a real app, you would use the toast component here
      alert("Failed to connect to backend. Is the python server running on port 8000?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Effect to draw the simulated track canvas (only when NOT analyzing)
  useEffect(() => {
    if (analysisResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    
    const getTrackPoint = (t: number) => {
        const totalLength = 2100; 
        const d = t * totalLength;

        if (d < 250) return { x: 150 + d, y: 450 };
        const d2 = d - 250;
        if (d2 < 471) {
            const angle = (Math.PI / 2) - (d2 / 471) * Math.PI; 
            return { x: 400 + Math.cos(angle) * 150, y: 300 - Math.sin(angle) * 150 };
        }
        const d3 = d2 - 471;
        if (d3 < 300) return { x: 400 + d3, y: 150 };
        const d4 = d3 - 300;
        if (d4 < 471) {
            const angle = (-Math.PI / 2) + (d4 / 471) * Math.PI; 
            return { x: 700 + Math.cos(angle) * 150, y: 300 + Math.sin(angle) * 150 };
        }
        const d5 = d4 - 471;
        return { x: 700 - d5, y: 450 };
    };

    const lerpColor = (color1: number[], color2: number[], factor: number) => {
        const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
        const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
        const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
        return `rgb(${r},${g},${b})`;
    };

    const colors = {
        high: [239, 68, 68], med: [34, 197, 94], low: [59, 130, 246]
    };

    const colorStops = [
        { t: 0.00, color: colors.high }, { t: 0.20, color: colors.med },
        { t: 0.35, color: colors.med }, { t: 0.50, color: colors.low },
        { t: 0.75, color: colors.high }, { t: 1.00, color: colors.high },
    ];

    const getGripColor = (t: number) => {
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (t >= colorStops[i].t && t <= colorStops[i+1].t) {
                const range = colorStops[i+1].t - colorStops[i].t;
                const localT = (t - colorStops[i].t) / range;
                return lerpColor(colorStops[i].color, colorStops[i+1].color, localT);
            }
        }
        return lerpColor(colors.high, colors.high, 0); 
    };

    const drawTrack = () => {
      ctx.clearRect(0, 0, 1000, 600);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 70; 
      ctx.strokeStyle = '#1a1a1a'; 
      ctx.shadowBlur = 0;
      
      ctx.beginPath();
      ctx.moveTo(150, 450);
      ctx.lineTo(400, 450);
      ctx.arc(400, 300, 150, Math.PI/2, -Math.PI/2, true);
      ctx.lineTo(700, 150);
      ctx.arc(700, 300, 150, -Math.PI/2, Math.PI/2, false);
      ctx.lineTo(150, 450);
      ctx.stroke();

      ctx.lineWidth = 45;
      const steps = 400; 
      
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
          ctx.shadowColor = col;
          ctx.shadowBlur = 15;
          ctx.stroke();
      }

      const time = Date.now() * 0.0002; 
      const loopT = time % 1;
      const carPos = getTrackPoint(loopT);
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(carPos.x, carPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LIVE", carPos.x, carPos.y - 18);
    };

    let animationFrameId: number;
    const render = () => {
      drawTrack();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [analysisResult]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {analysisResult ? (
                <>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Analysis Mode</h2>
                </>
            ) : (
                <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Session</h2>
                </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">Track View</h1>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          {analysisResult ? (
             <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                onClick={clearAnalysis}
             >
                <X className="w-4 h-4" />
                Close Analysis
             </Button>
          ) : (
            <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="gap-2 bg-card/50 backdrop-blur-sm border-white/10 hover:bg-white/5">
            <Layers className="w-4 h-4" />
            Layers
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Track Canvas/Image Card */}
        <Card className="lg:col-span-3 p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
          
          {/* Header inside Card - Changes based on state */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Grip Heatmap</h2>
                <p className="text-xs text-muted-foreground">
                    {analysisResult 
                        ? `Processed: ${new Date(analysisResult.timestamp).toLocaleTimeString()}`
                        : "Real-time surface friction coefficient"
                    }
                </p>
            </div>
            
            {/* Dynamic Stats Legend - FIXED */}
            <div className="flex items-center gap-6 text-xs font-medium">
                {analysisResult ? (
                    <>
                         <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-foreground">Max Danger: {analysisResult.statistics.max_danger_score}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-foreground">Low Grip: {analysisResult.statistics.dangerous_area_percentage}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Layers className="w-3 h-3 text-muted-foreground" />
                            <span className="text-foreground">Patches: {analysisResult.statistics.total_patches_analyzed}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                {analysisResult.statistics.safety_status}
                            </span>
                         </div>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
          </div>
          
          {/* View Container */}
          <div className="relative w-full h-[500px] bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
            {/* Loading Overlay */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    <span className="text-sm font-medium text-white">Processing Friction Data...</span>
                </div>
            )}

            {/* Content Switcher: Canvas or Analysis Image */}
            {analysisResult ? (
                 <div className="w-full h-full flex items-center justify-center bg-black">
                    {/* Display the heatmap using Base64 */}
                    <img 
                        src={`data:image/jpeg;base64,${analysisResult.heatmap_base64}`} 
                        alt="Friction Analysis Heatmap" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                            console.error("Image failed to load", e);
                            alert("Failed to load heatmap image");
                        }}
                    />
                 </div>
            ) : (
                <>
                    {/* Subtle Grid Background for Canvas */}
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
                </>
            )}
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