
import React from "react";
import { Link } from "react-router-dom";
import { 
  Wallet, 
  ChartBar, 
  Settings, 
  CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors group",
        active ? "bg-sidebar-accent font-medium" : ""
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  activePath: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  const links = [
    {
      to: "/",
      icon: <ChartBar className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      to: "/transactions",
      icon: <Wallet className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      to: "/calendar",
      icon: <CalendarIcon className="w-5 h-5" />,
      label: "Calendar",
    },
    {
      to: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <div className="w-60 h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          <span>Income Zenith</span>
        </h1>
      </div>

      <nav className="mt-6 px-3 flex-1">
        <div className="space-y-1.5">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={activePath === link.to}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="font-semibold text-sm">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-sidebar-foreground/70">Personal Account</p>
          </div>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
