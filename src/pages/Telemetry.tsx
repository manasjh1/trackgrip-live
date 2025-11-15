import { Card } from "@/components/ui/card";
import { Activity, Gauge, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const Telemetry = () => {
  const [speed, setSpeed] = useState(0);
  const [lateralG, setLateralG] = useState(0);
  const [wheelSlip, setWheelSlip] = useState(0);

  useEffect(() => {
    // Simulate real-time telemetry data
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 100) + 150);
      setLateralG(Math.random() * 4 - 2);
      setWheelSlip(Math.random() * 15);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Live Telemetry</h1>
          <p className="text-muted-foreground">Real-time car data and grip correlation</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Gauge className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-3xl font-bold text-foreground">{speed}</p>
                <p className="text-xs text-muted-foreground">km/h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Activity className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lateral G</p>
                <p className="text-3xl font-bold text-foreground">{lateralG.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">g-force</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wheel Slip</p>
                <p className="text-3xl font-bold text-foreground">{wheelSlip.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Car Dynamics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Throttle Position</span>
                  <span className="text-foreground font-medium">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Brake Pressure</span>
                  <span className="text-foreground font-medium">12%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Steering Angle</span>
                  <span className="text-foreground font-medium">23°</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '46%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Downforce Level</span>
                  <span className="text-foreground font-medium">High</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Grip Correlation</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Current Section</span>
                  <span className="text-xs text-success">High Grip</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>Expected G: 2.8</p>
                    <p>Actual G: 2.7</p>
                  </div>
                  <div>
                    <p>Expected Slip: 5%</p>
                    <p>Actual Slip: 4.8%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="text-sm font-medium text-foreground mb-2">Training Data</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Samples collected:</span>
                    <span className="text-foreground">14,523</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model accuracy:</span>
                    <span className="text-success">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last update:</span>
                    <span className="text-foreground">2.3s ago</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="text-sm font-medium text-foreground mb-2">Grip Predictions</h3>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">Next turn (T5): <span className="text-warning">Medium grip detected</span></p>
                  <p className="text-muted-foreground">Confidence: <span className="text-foreground">89%</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Telemetry;
