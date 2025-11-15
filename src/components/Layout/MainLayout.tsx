
import React from "react";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePath={location.pathname} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
