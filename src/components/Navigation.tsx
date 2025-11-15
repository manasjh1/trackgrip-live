import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Map, Activity, Camera } from "lucide-react";

const Navigation = () => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Overview" },
    { to: "/track", icon: Map, label: "Track" },
    { to: "/telemetry", icon: Activity, label: "Data" },
    { to: "/cameras", icon: Camera, label: "Feeds" },
  ];

  return (
    <div className="sticky top-4 z-50 flex justify-center w-full px-4 mb-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-background/60 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-1.5 mr-2 border-r border-white/10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-sm tracking-wide text-foreground hidden sm:block">TrackGrip</span>
        </div>
        
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-white/5"
            activeClassName="bg-primary/10 text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]"
          >
            <link.icon className="w-4 h-4" />
            <span className="hidden sm:block">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;