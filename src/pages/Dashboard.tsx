import { Card } from "@/components/ui/card";
import { Activity, AlertTriangle, Camera, MapPin, Zap, CloudRain, Sun, Thermometer, Droplets, Wind } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [activeAlerts, setActiveAlerts] = useState(0);
    const [activeCameras, setActiveCameras] = useState(8);
    // Simulated weather state
    const [weather, setWeather] = useState({
        condition: 'Dry', // Dry, Damp, Wet
        airTemp: 24,
        trackTemp: 38,
        humidity: 45
    });
  
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveAlerts(Math.floor(Math.random() * 3));
        setActiveCameras(7 + Math.floor(Math.random() * 2));
        
        // Simulate changing weather/track conditions slightly
        setWeather(prev => ({
            ...prev,
            trackTemp: prev.trackTemp + (Math.random() * 0.4 - 0.2),
            humidity: Math.min(100, Math.max(0, prev.humidity + (Math.random() * 2 - 1)))
        }));
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen p-6 pt-0 space-y-8 pb-20">
            {/* Header Stats */}
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-end justify-between mb-8">
                     <div>
                        <h2 className="text-sm font-medium text-primary mb-1 uppercase tracking-wider">Mission Control</h2>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Overview</h1>
                     </div>
                     <div className="flex items-center gap-4">
                        {/* NEW: Weather Widget for Dashboard */}
                        <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full bg-card/50 backdrop-blur-md border border-white/10">
                            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                                {weather.condition === 'Wet' ? (
                                    <CloudRain className="w-4 h-4 text-blue-400 animate-bounce" />
                                ) : (
                                    <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                                )}
                                <span className={`text-sm font-bold ${weather.condition === 'Wet' ? 'text-blue-400' : 'text-amber-400'}`}>
                                    {weather.condition.toUpperCase()} TRACK
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                                <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {weather.airTemp.toFixed(1)}°C Air</span>
                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {weather.trackTemp.toFixed(1)}°C Track</span>
                                <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity.toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                System Normal
                            </span>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <StatsCard 
                        title="Camera Feed" 
                        value={`${activeCameras}/8`} 
                        icon={Camera} 
                        trend="+98% uptime" 
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                     />
                     <StatsCard 
                        title="Track Coverage" 
                        value="94%" 
                        icon={MapPin} 
                        trend="Optimal" 
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                     />
                     {/* Replaced Latency with Environmental Info since it's relevant to grip */}
                     <StatsCard 
                        title="Track Condition" 
                        value={weather.condition} 
                        icon={weather.condition === 'Wet' ? CloudRain : Sun}
                        trend={`${weather.trackTemp.toFixed(1)}°C Surf.`} 
                        color={weather.condition === 'Wet' ? "text-blue-400" : "text-amber-400"}
                        bg={weather.condition === 'Wet' ? "bg-blue-500/10" : "bg-amber-500/10"}
                        alert={weather.condition === 'Wet'} // Highlight if wet
                     />
                     <StatsCard 
                        title="Active Alerts" 
                        value={activeAlerts} 
                        icon={AlertTriangle} 
                        trend={activeAlerts > 0 ? "Attention needed" : "All Clear"} 
                        alert={activeAlerts > 0} 
                        color="text-red-400"
                        bg="bg-red-500/10"
                     />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <Card className="lg:col-span-2 p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-foreground">Grip Heatmap Overview</h3>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> High</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> Med</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"/> Low</span>
                            </div>
                        </div>
                        {/* Placeholder for heatmap visual */}
                        <div className="w-full h-64 rounded-lg bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-rose-500/10 border border-white/5 relative overflow-hidden group">
                             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm z-10">
                                <Activity className="w-4 h-4 mr-2 opacity-50" /> Live Track Map Rendering...
                             </div>
                             {/* Scanline effect */}
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-[scan_2s_linear_infinite] h-full w-full" />
                             
                             {/* Wet weather overlay effect if needed */}
                             {weather.condition === 'Wet' && (
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/82/Rain_drops_on_window_02.jpg')] bg-cover opacity-10 mix-blend-overlay pointer-events-none" />
                             )}
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                             <GripStatus turn="T1-T3" status="98%" />
                             <GripStatus turn="T4-T5" status="92%" />
                             <GripStatus turn="T6-T9" status="85%" warning />
                             <GripStatus turn="Main Straight" status="99%" />
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6 h-full flex flex-col">
                            <h3 className="font-semibold mb-4 text-foreground">System Log</h3>
                            <div className="space-y-0 flex-1">
                                <TimelineItem time="10:42:05" title="Marble buildup T4" type="warning" />
                                <TimelineItem time="10:40:12" title="Sector 2 Yellow Flag" type="neutral" />
                                <TimelineItem time="10:25:00" title="System Calibration" type="success" />
                                <TimelineItem time="10:15:30" title="Track Temp +2°C" type="neutral" />
                                <TimelineItem time="10:10:00" title="Session Started" type="success" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Updated StatsCard with "Sparkline" and glow effects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, icon: Icon, trend, alert, color, bg }: any) {
    return (
        <Card className="p-5 relative overflow-hidden group">
            {/* Background glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${alert ? 'bg-red-500' : 'bg-primary'}`} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className={`p-2.5 rounded-lg border border-white/5 ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {alert && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </div>
            
            <div className="mt-4 relative z-10">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-end gap-2 mt-1">
                    <h4 className="text-3xl font-bold tracking-tight text-foreground">{value}</h4>
                    <p className={`text-xs mb-1 font-medium ${alert ? 'text-red-400' : 'text-emerald-400'}`}>
                        {trend}
                    </p>
                </div>
                
                {/* Fake Sparkline Graphic */}
                <div className="h-1 w-full mt-3 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-full flex-1 rounded-full opacity-60 ${alert ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ 
                                height: `${30 + Math.random() * 70}%`, 
                                opacity: 0.2 + (i / 12) * 0.8 
                            }} 
                        />
                    ))}
                </div>
            </div>
        </Card>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GripStatus({ turn, status, warning }: any) {
    return (
        <div className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
            <p className="text-xs text-muted-foreground mb-1 group-hover:text-white transition-colors">{turn}</p>
            <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-foreground">{status}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${warning ? 'bg-amber-500 shadow-[0_0_8px_hsl(var(--warning))]' : 'bg-emerald-500 shadow-[0_0_8px_hsl(var(--success))]'}`} />
            </div>
            <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                <div className={`h-full ${warning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: status }} />
            </div>
        </div>
    )
}

// Updated TimelineItem with Terminal look
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimelineItem({ time, title, type }: any) {
    const colorClass = type === 'warning' ? 'text-amber-400' : type === 'success' ? 'text-emerald-400' : 'text-blue-400';
    const borderClass = type === 'warning' ? 'border-amber-500/50' : type === 'success' ? 'border-emerald-500/50' : 'border-blue-500/50';
    const bgClass = type === 'warning' ? 'bg-amber-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500';

    return (
        <div className="relative group pl-6 pb-2 last:pb-0">
             {/* Vertical line */}
            <div className="absolute left-[4.5px] top-3 bottom-0 w-px bg-white/10 group-last:hidden" />
            
            {/* The Dot */}
            <div className={`absolute left-0 top-2.5 w-2.5 h-2.5 rounded-full border-2 bg-background ${borderClass} shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all group-hover:scale-125 group-hover:shadow-[0_0_10px_currentColor] ${colorClass}`}>
                <div className={`w-full h-full rounded-full opacity-50 ${bgClass}`} />
            </div>

            <div className="flex justify-between items-center p-2 rounded-md transition-colors hover:bg-white/5 cursor-default border border-transparent hover:border-white/5">
                <span className="text-sm font-medium text-foreground/90 font-mono">
                    <span className={`mr-2 opacity-70 ${colorClass}`}>›</span>
                    {title}
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                    {time}
                </span>
            </div>
        </div>
    )
}

export default Dashboard;