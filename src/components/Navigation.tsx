import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Map, Activity, Camera } from "lucide-react";

const Navigation = () => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/track", icon: Map, label: "Track View" },
    { to: "/telemetry", icon: Activity, label: "Telemetry" },
    { to: "/cameras", icon: Camera, label: "Cameras" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent" />
            <span className="font-bold text-lg text-foreground">TrackGrip</span>
          </div>
          
          <div className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                activeClassName="bg-primary/10 text-foreground"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
