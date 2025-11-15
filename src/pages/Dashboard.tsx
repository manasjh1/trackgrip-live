import { Card } from "@/components/ui/card";
import { Activity, AlertTriangle, Camera, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [activeCameras, setActiveCameras] = useState(8);
  const [trackStatus, setTrackStatus] = useState("green");

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveAlerts(Math.floor(Math.random() * 3));
      setActiveCameras(7 + Math.floor(Math.random() * 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              TrackGrip Vision
            </h1>
            <p className="text-muted-foreground">Real-time Track Grip Analysis System</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${trackStatus === 'green' ? 'bg-success' : 'bg-warning'} animate-pulse shadow-lg`} style={{
              boxShadow: trackStatus === 'green' ? '0 0 20px hsl(var(--glow-success))' : '0 0 20px hsl(var(--glow-warning))'
            }} />
            <span className="text-sm font-medium">SYSTEM ACTIVE</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border hover:border-accent transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Camera className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cameras</p>
                <p className="text-2xl font-bold text-foreground">{activeCameras}/8</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-success transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold text-foreground">94%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-foreground">{activeAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-secondary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latency</p>
                <p className="text-2xl font-bold text-foreground">1.2s</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Track Status */}
          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Track Status Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-foreground">Turn 1-3: High Grip</span>
                </div>
                <span className="text-sm text-muted-foreground">Optimal</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-foreground">Turn 5: Medium Grip</span>
                </div>
                <span className="text-sm text-muted-foreground">Marbles detected</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-foreground">Main Straight: High Grip</span>
                </div>
                <span className="text-sm text-muted-foreground">Rubbered line</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-foreground">Turn 7-9: High Grip</span>
                </div>
                <span className="text-sm text-muted-foreground">Optimal</span>
              </div>
            </div>
          </Card>

          {/* Recent Alerts */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Marble buildup</p>
                    <p className="text-xs text-muted-foreground">Turn 5 - 2min ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Grip improved</p>
                    <p className="text-xs text-muted-foreground">Turn 1 - 5min ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">System calibration</p>
                    <p className="text-xs text-muted-foreground">Camera 3 - 12min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
